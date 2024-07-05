import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { ListPostQueryDto, UpdatePostDto, UpdatePostFolderDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostsRepository) {}

  async listPost(userId: string, query: ListPostQueryDto) {
    const [count, posts] = await Promise.all([
      this.postRepository.getUserPostCount(userId),
      this.postRepository.listPost(
        userId,
        query.page,
        query.limit,
        query.favorite,
        query.order,
      ),
    ]);
    return {
      count,
      posts,
    };
  }

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

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    // Find if user post exist
    await this.postRepository.findPostOrThrow(userId, postId);

    // Update post data
    await this.postRepository.updatePost(userId, postId, dto);

    return true;
  }

  async updatePostFolder(
    userId: string,
    postId: string,
    dto: UpdatePostFolderDto,
  ) {
    // Find if post exist
    await this.postRepository.findPostOrThrow(userId, postId);

    // Update post folder id
    await this.postRepository.updatePostFolder(userId, postId, dto.folderId);

    //return response;
    return true;
  }

  async deletePost(userId: string, postId: string) {
    // Find if post is user's post. If it's not throw NotFoundError
    const post = await this.postRepository.findPostOrThrow(userId, postId);
    await this.postRepository.deletePost(
      userId,
      postId,
      post.aiClassificationId.toString(),
    );
    return true;
  }
}
