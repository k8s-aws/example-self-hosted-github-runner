import * as cdk from "aws-cdk-lib";
import {
  ComputeType,
  IBuildImage,
  LinuxArmBuildImage,
  Project,
  Source,
} from "aws-cdk-lib/aws-codebuild";
import { IVpc, Vpc } from "aws-cdk-lib/aws-ec2";
import {
  IRole,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export type GithubRunnerProps = {
  vpcId: string;
  runnerRoleName: string;
  githuOrgName: string;
  buildImage?: IBuildImage;
  computeType?: ComputeType;
};

export type GithubRunnerStackProps = cdk.StackProps & {
  resourceProps: GithubRunnerProps;
};

export class GithubRunnerStack extends cdk.Stack {
  runnerRole: Role;
  vpc: IVpc;
  publicRunner: Project;
  privateRunner: Project;
  resourceProps: GithubRunnerProps;
  constructor(scope: Construct, id: string, props: GithubRunnerStackProps) {
    super(scope, id, props);
    this.resourceProps = props.resourceProps;
    this.runnerRole = this.createGithubRunnerRole();
    this.vpc = this.getVpc();
    this.createGithubRunner("github-runner-public");
    this.createGithubRunner("github-runner-private", this.vpc);
  }

  private getVpc(): IVpc {
    return Vpc.fromLookup(this, "vpc", {
      vpcId: this.resourceProps.vpcId,
    });
  }

  // Below role is created with admin access (against Principle of Least Privelege) only for learning purposes
  private createGithubRunnerRole(): Role {
    return new Role(this, "github-runner-role", {
      roleName: this.resourceProps.runnerRoleName,
      assumedBy: new ServicePrincipal("codebuild.amazonaws.com"),
      description: "Role used by Githun runner to perform deployments",
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ],
    });
  }

  private createGithubRunner(projectName: string, vpc?: IVpc): Project {
    return new Project(this, projectName, {
      projectName,
      source: Source.gitHub({
        owner: this.resourceProps.githuOrgName,
        webhook: true,
      }),
      environment: {
        buildImage:
          this.resourceProps.buildImage ||
          LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
        computeType: this.resourceProps.computeType || ComputeType.SMALL,
      },
      role: this.runnerRole,
      vpc,
    });
  }
}
