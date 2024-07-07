import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema, Post, PostSchema } from '@src/infrastructure';
import { UsersModule } from '@src/modules/users/users.module';
import { FolderRepository } from '../folders/folders.repository';
import { AwsLambdaModule } from '@src/infrastructure/aws-lambda/aws-lambda.module';
import { AwsLambdaService } from '@src/infrastructure/aws-lambda/aws-lambda.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
    UsersModule,
    AwsLambdaModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    FolderRepository,
    AwsLambdaService,
  ],
})
export class PostsModule {}
