import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { PaginationQuery } from '@src/common';
import { GetPostDto } from '@src/modules/posts/dto/getPostDto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostsRepository) {}
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
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

  async getPost(
    userId: string,
    paginationQuery: PaginationQuery,
    isFavorite?: boolean,
  ) {
    const postList = await this.postRepository.readPost(
      userId,
      paginationQuery,
      isFavorite,
    );
    const postCount = await this.postRepository.readPostCount(
      userId,
      paginationQuery,
      isFavorite,
    );
    const postDtoList = postList.map((post) => {
      return new GetPostDto(post);
    });
    return { postDtoList, postCount };
  }
}
