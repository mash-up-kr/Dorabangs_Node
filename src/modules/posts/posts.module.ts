import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AIClassification,
  Post,
  PostAIClassificationSchema,
  PostSchema,
} from '@src/infrastructure';
import { UsersModule } from '@src/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: AIClassification.name, schema: PostAIClassificationSchema },
    ]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
