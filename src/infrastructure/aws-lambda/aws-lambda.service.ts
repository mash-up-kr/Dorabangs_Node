import { Injectable } from '@nestjs/common';
import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda';
@Injectable()
export class AwsLambdaService {
  readonly client = new LambdaClient({ region: 'ap-northeast-2' });
}
