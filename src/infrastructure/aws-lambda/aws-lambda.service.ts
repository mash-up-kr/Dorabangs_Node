import { Injectable } from '@nestjs/common';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AwsLambdaService {
  // 요청 보낼 수 있는 최대 사이즈
  private MAX_PAYLOAD_SIZE = 262144; // 256 KB
  constructor(private readonly config: ConfigService) {}
  readonly client = new LambdaClient({
    region: 'ap-northeast-2',
    credentials: {
      accessKeyId: this.config.get<string>('AWS_LAMBDA_ACCESS_KEY'),
      secretAccessKey: this.config.get<string>('AWS_LAMBDA_SECRET_KEY'),
    },
  });

  async invokeLambda(
    lambdaFunctionName: string,
    payload: object,
  ): Promise<void> {
    // 추가 코드 - 시작
    let payloadString = JSON.stringify(payload);
    let payloadUint8Array = new TextEncoder().encode(payloadString);
    if (payloadUint8Array.length > this.MAX_PAYLOAD_SIZE) {
      console.warn(
        `Payload size is ${payloadUint8Array.length} bytes, truncating to ${this.MAX_PAYLOAD_SIZE} bytes`,
      );
      payloadString = payloadString.slice(0, this.MAX_PAYLOAD_SIZE - 100); // Adjust size to account for possible encoding expansion
      payloadUint8Array = new TextEncoder().encode(payloadString);
    }
    // 추가 코드 - 끝
    const command = new InvokeCommand({
      FunctionName: lambdaFunctionName,
      InvocationType: 'Event',
      Payload: payloadUint8Array,
    });
    try {
      // response 확인용 추가 코드
      const response = await this.client.send(command);
      console.log('Lambda function invoked successfully:', response);
      if (response.Payload) {
        const decoder = new TextDecoder('utf-8');
        const responsePayloadString = decoder.decode(response.Payload);
        console.log('Response payload:', responsePayloadString);
      } else {
        console.log('No response payload');
      }
    } catch (error) {
      console.error('Error invoking Lambda function:', error);
      throw error;
    }
  }
}
