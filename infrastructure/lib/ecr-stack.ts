import * as ecr from "aws-cdk-lib/aws-ecr";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

const PREFIX = "meson-nexus";

export class EcrStack extends cdk.Stack {
  repository: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, "Repository", {
      repositoryName: `${PREFIX}-repository`,
    });
    this.repository = repository;
  }
}
