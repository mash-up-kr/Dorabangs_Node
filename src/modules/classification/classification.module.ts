import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Folder,
  FolderSchema,
  Post,
  AIClassification,
  AIClassificationSchema,
  PostSchema,
} from '@src/infrastructure/database/schema';

import { ClassificationController } from './classification.controller';
import { ClassficiationRepository } from './classification.repository';
import { PostsRepository } from '../posts/posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: AIClassification.name, schema: AIClassificationSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [ClassificationController],
  providers: [ClassificationService, ClassficiationRepository, PostsRepository],
})
export class ClassificationModule {}
