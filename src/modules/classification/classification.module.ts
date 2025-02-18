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
import { FolderRepository } from '../folders/folders.repository';
import { PostsRepository } from '../posts/posts.repository';
import { ClassificationController } from './classification.controller';
import { ClassficiationRepository } from './classification.repository';
import { ClassificationService } from './classification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: AIClassification.name, schema: AIClassificationSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [ClassificationController],
  providers: [
    ClassificationService,
    ClassficiationRepository,
    PostsRepository,
    FolderRepository,
  ],
  exports: [ClassificationService],
})
export class ClassificationModule {}
