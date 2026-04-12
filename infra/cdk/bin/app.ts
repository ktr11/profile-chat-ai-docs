#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DataStack } from "../lib/stacks/data-stack";
import { ApiStack } from "../lib/stacks/api-stack";

const app = new cdk.App();

const stage = app.node.tryGetContext("stage") ?? "dev";
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
};

const dataStack = new DataStack(app, `ProfileChatData-${stage}`, { env, stage });

new ApiStack(app, `ProfileChatApi-${stage}`, {
  env,
  stage,
  checkpointTable: dataStack.checkpointTable,
  stateBucket: dataStack.stateBucket,
});
