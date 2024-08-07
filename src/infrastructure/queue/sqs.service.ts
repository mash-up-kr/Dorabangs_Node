import { SQS, SendMessageRequest } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IQeueuService } from './queue.service';

@Injectable()
export class SQSService implements IQeueuService {
  private queue: SQS;

  constructor(private readonly config: ConfigService) {
    this.queue = new SQS({
      region: 'ap-northeast-2',
    });
  }

  async send<T>(data: T) {
    const queueUrl = this.config.get('AIEventQueue');
    const payload: SendMessageRequest = {
      QueueUrl: queueUrl,
      DelaySeconds: 1,
      MessageBody: JSON.stringify(data),
      MessageGroupId: 'AI_CLASSIFICATION_EVENT',
    };

    await this.queue.sendMessage(payload);
  }
}
