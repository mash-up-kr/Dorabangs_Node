import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Folder,
  FolderSchema,
  PostAIClassification,
  PostAIClassificationSchema,
} from '@src/schema';
import { ClassificationController } from './classification.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: PostAIClassification.name, schema: PostAIClassificationSchema },
    ]),
  ],
  controllers: [ClassificationController],
  providers: [ClassificationService],
})
export class ClassificationModule {}
