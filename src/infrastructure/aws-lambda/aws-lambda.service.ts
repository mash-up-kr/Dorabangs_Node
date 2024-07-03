import { Injectable } from '@nestjs/common';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AwsLambdaService {
  constructor(private readonly config: ConfigService) {}
  // TODO  credentials 추가 필요 (acccess_key, secret_key)
  readonly client = new LambdaClient({
    region: 'ap-northeast-2',
    credentials: {
      accessKeyId: this.config.get<string>('AWS_ACCESS_KEY'),
      secretAccessKey: this.config.get<string>('AWS_SECRET_KEY'),
    },
  });

  invokeLambda(lambdaFunctionName: string, payload: object): void {
    const command = new InvokeCommand({
      FunctionName: lambdaFunctionName,
      InvocationType: 'Event',
      Payload: JSON.stringify(payload),
    });
    this.client.send(command);
  }
}
