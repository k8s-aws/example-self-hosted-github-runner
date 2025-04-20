#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { GithubRunnerStack } from "../lib/iac-stack";
import { ComputeType, LinuxArmBuildImage } from "aws-cdk-lib/aws-codebuild";

const app = new cdk.App();
new GithubRunnerStack(app, "IacStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  resourceProps: {
    vpcId: "vpc-0a2700dde1b6d1442",
    runnerRoleName: "github-runner-role",
    githuOrgName: "k8s-aws",
    computeType: ComputeType.SMALL,
    buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
  },
});
