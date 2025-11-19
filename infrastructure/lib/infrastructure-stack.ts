import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elasticloadbalancing from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as logs from "aws-cdk-lib/aws-logs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

const VPC_NAME = "meson-nexus-vpc";

interface ECSStackProps extends cdk.StackProps {
  projectName: string;
  environment: string;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    repository: ecr.Repository,
    props: ECSStackProps
  ) {
    super(scope, id, props);

    const projectName = props.projectName;
    const projectPrefix = `${projectName}-${props.environment}-server`;

    const vpc = new ec2.Vpc(this, `rds-vpc`, {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
      subnetConfiguration: [
        { name: "Public", subnetType: ec2.SubnetType.PUBLIC, cidrMask: 24 },
        {
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: "Isolated",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    const dbProxyGroup = new ec2.SecurityGroup(this, "proxy-group", {
      vpc,
      allowAllOutbound: true,
    });
    const rdsGroup = new ec2.SecurityGroup(this, `rds-group`, {
      vpc,
      allowAllOutbound: true,
    });

    rdsGroup.addIngressRule(
      dbProxyGroup,
      ec2.Port.tcp(5432),
      "allow proxy to rds connection"
    );

    const lambdaGroup = new ec2.SecurityGroup(this, "lambda-group", {
      vpc,
      allowAllOutbound: true,
    });
    dbProxyGroup.addIngressRule(
      lambdaGroup,
      ec2.Port.tcp(5432),
      "allow lambda to proxy connection"
    );

    const dbAdminSecret = new secretsmanager.Secret(
      this,
      "database-admin-secret",
      {
        secretName: `dbAdminLoginInfo`,
        generateSecretString: {
          excludeCharacters: ":@/\" '",
          generateStringKey: "password",
          passwordLength: 8,
          secretStringTemplate: '{"username": "postgres"}',
        },
      }
    );

    const dbClusterIdentifier = "rds-cluster";
    const dbInstanceIdentifier = "rds-instance";

    const subnetGroupName = `rds-subnet-group`.toLowerCase();
    const subnetGroup = new rds.SubnetGroup(this, subnetGroupName, {
      description: subnetGroupName,
      vpc,
      subnetGroupName: subnetGroupName,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }),
    });

    const dbCluster = new rds.DatabaseCluster(this, dbClusterIdentifier, {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_16_3,
      }),
      vpc: vpc,
      securityGroups: [rdsGroup],
      subnetGroup: subnetGroup,
      enableDataApi: true,
      writer: rds.ClusterInstance.serverlessV2(
        `${dbInstanceIdentifier}-writer`
      ),
      readers: [
        rds.ClusterInstance.serverlessV2(`${dbInstanceIdentifier}-reader`, {
          scaleWithWriter: true,
        }),
      ],
      serverlessV2MinCapacity: 1,
      serverlessV2MaxCapacity: 64,
      backup: {
        retention: cdk.Duration.days(7),
        preferredWindow: "16:00-16:30",
      },
      cloudwatchLogsExports: ["postgresql"],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_WEEK,
      clusterIdentifier: dbClusterIdentifier,
      copyTagsToSnapshot: true,
      credentials: rds.Credentials.fromSecret(dbAdminSecret),
      deletionProtection: false,
      iamAuthentication: false,
      instanceIdentifierBase: dbInstanceIdentifier,
      preferredMaintenanceWindow: "Sat:17:00-Sat:17:30",
      storageEncrypted: true,
    });

    const proxy = dbCluster.addProxy("rds-proxy", {
      secrets: [dbAdminSecret],
      debugLogging: true,
      vpc: vpc,
      securityGroups: [dbProxyGroup],
    });

    const keyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "key-011930fdd2d4f584c",
      "nexus-bastion"
    );

    const bastion = new ec2.Instance(this, "BastionHost", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.NANO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      keyPair,
    });

    bastion.connections.allowFromAnyIpv4(ec2.Port.tcp(22), "SSH access");

    rdsGroup.addIngressRule(
      bastion.connections.securityGroups[0],
      ec2.Port.tcp(5432),
      "allow bastion to rds"
    );

    // Create a security group that allows HTTP traffic on port 80 for the ECS container
    const ecsSecGroup = new ec2.SecurityGroup(this, "EcsSecurityGroup", {
      securityGroupName: `${projectName}-${props.environment}-SecGroup`,
      vpc,
      allowAllOutbound: false,
    });

    ecsSecGroup.addIngressRule(ec2.Peer.ipv4("0.0.0.0/0"), ec2.Port.tcp(3000));

    // Create cluster
    const cluster = new ecs.Cluster(this, `ECS-Cluster`, {
      clusterName: `${projectPrefix}-cluster`,
      vpc,
    });

    // Create a fargate task definition
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "FargateTaskDefinition",
      {
        memoryLimitMiB: 512,
        cpu: 256,
      }
    );

    const ecsContainer = fargateTaskDefinition.addContainer(
      "NginxServerContainer",
      {
        image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
        cpu: 100,
        memoryLimitMiB: 256,
        essential: true,
        logging: ecs.LogDrivers.awsLogs({ streamPrefix: "nginx-ecs-server" }),
        environment: {
          DB_TYPE: "postgres",
          DB_HOST: "localhost",
          DB_PORT: "5432",
          DB_USERNAME: "postgres",
          DB_PASSWORD: process.env.DB_PASSWORD || "postgrespassword",
          DB_DATABASE: "postgres",

          JWT_SECRET: "superSecretKey",
          JWT_EXPIRES_IN: "1d",
          JWT_REFRESH_TOKEN_SECRET: "superRefreshSecretKey",
          JWT_REFRESH_TOKEN_EXPIRES_IN: "7d",

          TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
          TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",

          TWILIO_KEY_ID: process.env.TWILIO_KEY_ID || "",
          TWILIO_SECRET_KEY: process.env.TWILIO_SECRET_KEY || "",
          TWILIO_VOICE_APP_ID: "",

          PORT: "3000",
        },
      }
    );

    ecsContainer.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // Create the service
    const ecsFargateService = new ecs.FargateService(this, "Ecs-Service", {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 2,
      assignPublicIp: false,
      securityGroups: [ecsSecGroup],
    });

    const lb = new elasticloadbalancing.ApplicationLoadBalancer(this, "ALB", {
      vpc,
      internetFacing: true,
    });

    const albListener = lb.addListener("AlbListener", {
      port: 80,
    });

    albListener.addTargets("Target", {
      port: 80,
      targets: [ecsFargateService],
      // healthCheck: { path: "/api/" },
    });

    albListener.connections.allowDefaultPortFromAnyIpv4("Open to all");
  }
}
