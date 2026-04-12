import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface ApiStackProps extends cdk.StackProps {
  stage: string;
  checkpointTable: dynamodb.Table;
  stateBucket: s3.Bucket;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    // TODO: 実装は docs/infrastructure/cdk-guide.md を参照
    throw new Error("Not implemented — see docs/infrastructure/cdk-guide.md");
  }
}
