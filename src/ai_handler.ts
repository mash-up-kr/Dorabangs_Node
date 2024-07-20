import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from '@src/infrastructure/ai/ai.service';
import { Handler } from 'aws-lambda';
import {
  DatabaseModule,
  Folder,
  FolderSchema,
  Post,
  PostSchema,
} from './infrastructure';
import { AiModule } from './infrastructure/ai/ai.module';
import { LambdaEventPayload } from './infrastructure/aws-lambda/type';
import { ClassficiationRepository } from './modules/classification/classification.repository';
import { PostKeywordsRepository } from './modules/posts/postKeywords.repository';
import { PostsRepository } from './modules/posts/posts.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
    AiModule,
  ],
  providers: [
    ClassficiationRepository,
    PostsRepository,
    PostKeywordsRepository,
  ],
})
class WorkerModule {}

export const handler: Handler = async (event: LambdaEventPayload) => {
  const app = await NestFactory.create(WorkerModule);
  const aiService = app.get(AiService);
  const classificationRepository = app.get(ClassficiationRepository);
  const postRepository = app.get(PostsRepository);
  const postKeywordsRepository = app.get(PostKeywordsRepository);

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
    event.url,
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
    await postKeywordsRepository.createPostKeywords(
      postId,
      summarizeUrlContent.response.keywords,
    );
  }

  // NOTE: cloud-watch 로그 확인용
  console.log({
    result: summarizeUrlContent.success ? 'success' : 'fail',
    event: JSON.stringify(event, null, 2),
    summarizeUrlContent: summarizeUrlContent,
  });
};
