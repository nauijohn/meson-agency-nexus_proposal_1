import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

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
      natGateways: 1,
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

    // VPC Endpoints for ECR & SecretsManager
    vpc.addInterfaceEndpoint("EcrApiEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      privateDnsEnabled: true,
    });
    vpc.addInterfaceEndpoint("EcrDkrEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      privateDnsEnabled: true,
    });
    vpc.addInterfaceEndpoint("SecretsManagerEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      privateDnsEnabled: true,
    });

    // Security groups
    const dbProxyGroup = new ec2.SecurityGroup(this, "proxy-group", {
      vpc,
      allowAllOutbound: true,
    });
    const rdsGroup = new ec2.SecurityGroup(this, "rds-group", {
      vpc,
      allowAllOutbound: true,
    });
    const ecsSecGroup = new ec2.SecurityGroup(this, "EcsSecurityGroup", {
      vpc,
      allowAllOutbound: true,
    });

    rdsGroup.addIngressRule(
      dbProxyGroup,
      ec2.Port.tcp(5432),
      "allow proxy to rds"
    );
    dbProxyGroup.addIngressRule(
      ecsSecGroup,
      ec2.Port.tcp(5432),
      "allow ECS to RDS proxy"
    );

    // Database credentials
    const dbAdminSecret = new secretsmanager.Secret(
      this,
      "database-admin-secret",
      {
        secretName: `dbAdminLoginInfo`,
        generateSecretString: {
          excludeCharacters: ":@/\" '",
          generateStringKey: "password",
          passwordLength: 16,
          secretStringTemplate: '{"username": "postgres"}',
        },
      }
    );

    // RDS Cluster
    const dbCluster = new rds.DatabaseCluster(this, "rds-cluster", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_16_3,
      }),
      vpc,
      securityGroups: [rdsGroup],
      instanceIdentifierBase: "rds-instance",
      enableDataApi: true,
      writer: rds.ClusterInstance.serverlessV2("writer"),
      readers: [rds.ClusterInstance.serverlessV2("reader")],
      credentials: rds.Credentials.fromSecret(dbAdminSecret),
      subnetGroup: new rds.SubnetGroup(this, "rds-subnet-group", {
        vpc,
        description: "RDS Subnet Group",
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      }),
      serverlessV2MinCapacity: 1,
      serverlessV2MaxCapacity: 64,
    });

    // RDS Proxy
    const proxy = dbCluster.addProxy("rds-proxy", {
      secrets: [dbAdminSecret],
      vpc,
      securityGroups: [dbProxyGroup],
      debugLogging: true,
    });

    // ECS Cluster & Fargate Service
    const cluster = new ecs.Cluster(this, "ECS-Cluster", { vpc });

    const fargateTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "FargateTaskDefinition",
      {
        memoryLimitMiB: 512,
        cpu: 256,
      }
    );

    fargateTaskDefinition.addToExecutionRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["*"],
      })
    );

    repository.grantPull(fargateTaskDefinition.taskRole);
    proxy.grantConnect(fargateTaskDefinition.taskRole);

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
          DB_HOST: proxy.endpoint, // <- must use RDS Proxy endpoint
          DB_PORT: "5432",
          DB_DATABASE: "postgres",

          JWT_SECRET: "superSecretKey",
          JWT_EXPIRES_IN: "1d",
          JWT_REFRESH_TOKEN_SECRET: "superRefreshSecretKey",
          JWT_REFRESH_TOKEN_EXPIRES_IN: "7d",

          PORT: "3000",
        },
        secrets: {
          DB_USERNAME: ecs.Secret.fromSecretsManager(dbAdminSecret, "username"),
          DB_PASSWORD: ecs.Secret.fromSecretsManager(dbAdminSecret, "password"),
        },
      }
    );

    ecsContainer.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    const ecsService = new ecs.FargateService(this, "EcsService", {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 2,
      securityGroups: [ecsSecGroup],
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, "ALB", {
      vpc,
      internetFacing: true,
    });

    // Create a listener on port 80
    const albListener = lb.addListener("AlbListener", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    // Add ECS service as target group on port 3000
    albListener.addTargets("TargetGroup", {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP, // must explicitly specify
      targets: [ecsService],
    });

    // Allow incoming HTTP from anywhere to ALB
    albListener.connections.allowDefaultPortFromAnyIpv4("Open to all");

    const keyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "key-011930fdd2d4f584c",
      "nexus-bastion" // replace with your key pair name
    );

    const bastion = new ec2.Instance(this, "BastionHost", {
      vpc,
      instanceType: new ec2.InstanceType("t3.micro"),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      securityGroup: new ec2.SecurityGroup(this, "BastionSG", { vpc }),
      keyPair,
    });

    bastion.connections.allowFromAnyIpv4(
      ec2.Port.tcp(22),
      "Allow SSH from anywhere"
    );

    dbProxyGroup.addIngressRule(
      bastion.connections.securityGroups[0],
      ec2.Port.tcp(5432)
    );
  }
}
