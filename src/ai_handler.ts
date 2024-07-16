import { Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AiService } from '@src/infrastructure/ai/ai.service';
import { AppModule } from '@src/app.module';

export const handler: Handler = async (event: any, context: Context) => {
  // event 데이터 잘 들어오는지 확인용
  const app = await NestFactory.create(AppModule);
  const aiService = app.get(AiService);

  // Post id
  event.postId;
  // NOTE: AI 요약 요청
  const summarizeUrlContent = await aiService.summarizeLinkContent(
    event.postContent,
    event.folderList,
  );
  if (summarizeUrlContent.success === true) {
    return true;
    // TODO create row PostAIClassification
  }
  return true;
};
