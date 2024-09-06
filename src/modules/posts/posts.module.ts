import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AIClassification,
  AIClassificationSchema,
  Folder,
  FolderSchema,
  Post,
  PostSchema,
} from '@src/infrastructure';
import {
  PostKeyword,
  PostKeywordSchema,
} from '@src/infrastructure/database/schema/postKeyword.schema';
import { QueueModule } from '@src/infrastructure/queue/queue.module';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { UsersModule } from '@src/modules/users/users.module';
import { AiClassificationModule } from '../ai-classification/ai-classification.module';
import { FolderRepository } from '../folders/folders.repository';
import { PostKeywordsRepository } from './postKeywords.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Folder.name, schema: FolderSchema },
      { name: AIClassification.name, schema: AIClassificationSchema },
      { name: PostKeyword.name, schema: PostKeywordSchema },
    ]),
    UsersModule,
    AiClassificationModule,
    QueueModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    FolderRepository,
    PostKeywordsRepository,
  ],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}
