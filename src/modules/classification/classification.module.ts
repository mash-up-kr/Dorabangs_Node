import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AIClassification,
  AIClassificationSchema,
  Folder,
  FolderSchema,
  Post,
  PostSchema,
} from '@src/infrastructure/database/schema';
import { ClassificationService } from './classification.service';

import { FoldersModule } from '../folders/folders.module';
import { PostsRepository } from '../posts/posts.repository';
import { ClassificationController } from './classification.controller';
import { ClassficiationRepository } from './classification.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: AIClassification.name, schema: AIClassificationSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    FoldersModule,
  ],
  controllers: [ClassificationController],
  providers: [ClassificationService, ClassficiationRepository, PostsRepository],
})
export class ClassificationModule {}
