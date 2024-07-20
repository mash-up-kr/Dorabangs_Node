import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AIClassification,
  AIClassificationSchema,
  Folder,
  FolderSchema,
  Keyword,
  KeywordSchema,
  Post,
  PostSchema,
} from '@src/infrastructure';
import { AiModule } from '@src/infrastructure/ai/ai.module';
import {
  PostKeyword,
  PostKeywordSchema,
} from '@src/infrastructure/database/schema/postKeyword.schema';
import { ClassficiationRepository } from '../classification/classification.repository';
import { FolderRepository } from '../folders/folders.repository';
import { KeywordsRepository } from '../keywords/keyword.repository';
import { PostKeywordsRepository } from '../posts/postKeywords.repository';
import { PostsRepository } from '../posts/posts.repository';
import { AiClassificationService } from './ai-classification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Folder.name, schema: FolderSchema },
      { name: Keyword.name, schema: KeywordSchema },
      { name: PostKeyword.name, schema: PostKeywordSchema },
      { name: AIClassification.name, schema: AIClassificationSchema },
    ]),
    AiModule,
  ],
  providers: [
    AiClassificationService,
    ClassficiationRepository,
    FolderRepository,
    PostsRepository,
    KeywordsRepository,
    PostKeywordsRepository,
  ],
  exports: [AiClassificationService],
})
export class AiClassificationModule {}
