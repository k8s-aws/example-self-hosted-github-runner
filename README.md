# example-self-hosted-github-runner

Deploys self hosted AWS CodeBuild Gitub runners (both public and private) using AWS CDK

## Steps to deploy

1. Run command at root `cd iac`
2. Run command `npm i`
3. Log into AWS from lcal system
4. Set environment variables AWS_PROFILE=my-profile AWS_REGION=my-region
5. If account/region is not bootstrapped, run command `cdk bootstrap`
6. Run command `cdk deploy`
