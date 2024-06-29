import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { Types } from 'mongoose';
import { PostsRepository } from '@src/modules/posts/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostsRepository) {
    this.postRepository = postRepository;
  }
  async createPost(
    createPostDto: CreatePostDto,
    userId: Types.ObjectId,
  ): Promise<boolean> {
    // TODO get title from url
    const title: string = 'temp title';

    return await this.postRepository.createPost(
      userId,
      createPostDto.folderId,
      createPostDto.url,
      title,
    );
  }
}
