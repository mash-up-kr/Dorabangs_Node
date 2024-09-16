import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Folder, FolderSchema, Post, PostSchema } from '@src/infrastructure';
import { ClassificationModule } from '@src/modules/classification/classification.module';

import { PostsModule } from '../posts/posts.module';
import { FoldersController } from './folders.controller';
import { FolderRepository } from './folders.repository';
import { FoldersService } from './folders.service';

@Module({
  imports: [
    ClassificationModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
    PostsModule,
  ],
  controllers: [FoldersController],
  providers: [FoldersService, FolderRepository],
})
export class FoldersModule {}
