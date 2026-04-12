import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface DataStackProps extends cdk.StackProps {
  stage: string;
}

export class DataStack extends cdk.Stack {
  public readonly checkpointTable: dynamodb.Table;
  public readonly stateBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);
    // TODO: 実装は docs/infrastructure/cdk-guide.md を参照
    throw new Error("Not implemented — see docs/infrastructure/cdk-guide.md");
  }
}
