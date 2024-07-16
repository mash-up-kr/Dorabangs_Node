import { Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AiService } from '@src/infrastructure/ai/ai.service';
import { AppModule } from '@src/app.module';
import { LambdaEventPayload } from './infrastructure/aws-lambda/type';
import { ClassficiationRepository } from './modules/classification/classification.repository';
import { PostsRepository } from './modules/posts/posts.repository';

export const handler: Handler = async (event: LambdaEventPayload) => {
  const app = await NestFactory.create(AppModule);
  const aiService = app.get(AiService);
  const classificationRepository = app.get(ClassficiationRepository);
  const postRepository = app.get(PostsRepository);

  // Map - (Folder Name):(Folder ID)
  const folderMapper = {};
  const folderNames = event.folderList.map((folder) => {
    folderMapper[folder.name] = folder.id;
    return folder.name;
  });

  // NOTE: AI 요약 요청
  const summarizeUrlContent = await aiService.summarizeLinkContent(
    event.postContent,
    folderNames,
  );

  // NOTE : 요약 성공 시 classification 생성, post 업데이트
  if (summarizeUrlContent.success) {
    const postId = event.postId;
    const folderId = folderMapper[summarizeUrlContent.response.category];
    const post = await postRepository.findPostByIdForAIClassification(postId);
    const classification = await classificationRepository.createClassification(
      post.url,
      summarizeUrlContent.response.summary,
      summarizeUrlContent.response.keywords,
      folderId,
    );
    await postRepository.updatePostClassificationForAIClassification(
      postId,
      classification._id.toString(),
      summarizeUrlContent.response.summary,
    );
  }

  // NOTE: cloud-watch 로그 확인용
  console.log({
    result: summarizeUrlContent.success ? 'success' : 'fail',
    event: JSON.stringify(event, null, 2),
    summarizeUrlContent: summarizeUrlContent,
  });
};
