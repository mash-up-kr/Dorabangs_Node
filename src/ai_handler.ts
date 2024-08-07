import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SQSHandler } from 'aws-lambda';
import { DatabaseModule } from './infrastructure';
import { AiModule } from './infrastructure/ai/ai.module';
import { AiClassificationPayload } from './infrastructure/aws-lambda/type';
import { DiscordModule } from './infrastructure/discord/discord.module';
import { AiClassificationModule } from './modules/ai-classification/ai-classification.module';
import { AiClassificationService } from './modules/ai-classification/ai-classification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    DatabaseModule,
    DiscordModule,
    AiModule,
    AiClassificationModule,
  ],
})
export class WorkerModule {}

export const handler: SQSHandler = async (event) => {
  const app = await NestFactory.create(WorkerModule);
  const aiClassificationService = app.get(AiClassificationService);

  for (const record of event.Records) {
    const body: AiClassificationPayload = JSON.parse(record.body);
    const result = await aiClassificationService.execute(body);

    // NOTE: cloud-watch 로그 확인용
    console.log({
      result: result.success ? 'success' : 'fail',
      event: JSON.stringify(event, null, 2),
      summarizeUrlContent: result,
    });
  }
};
