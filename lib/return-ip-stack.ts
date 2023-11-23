import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ReturnIpStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda 関数の定義
    const myFunction = new lambda.Function(this, 'MyFunction', {
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            body: JSON.stringify({ ip: event.requestContext.identity.sourceIp }),
          };
        };
      `),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    });

    // API Gateway の定義
    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'Client IP API',
      deployOptions: {
        stageName: 'prod',
      },
    });

    // Lambda 関数への統合
    const integration = new apigateway.LambdaIntegration(myFunction, {
      requestTemplates: { "application/json": '{ "statusCode": 200 }' }
    });

    // リソースとメソッドの追加
    api.root.addMethod('GET', integration);
  }
}
