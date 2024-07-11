import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { PaginationQuery } from '@src/common';
import { GetPostDto } from '@src/modules/posts/dto/getPostDto';
import { GetPostQueryDto } from '@src/modules/posts/dto/find-in-folder.dto';
import { FolderRepository } from '@src/modules/folders/folders.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly folderRepository: FolderRepository,
  ) {}

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

  /**
   * @todo
   * post 조회하는 플로우까지 개발되면 읽지 않음 여부 필터 적용하기
   */
  async findByFolderId(
    userId: string,
    folderId: string,
    query: GetPostQueryDto,
  ) {
    await this.folderRepository.findOneOrFail({
      _id: folderId,
      userId,
    });
    const offset = (query.page - 1) * query.limit;
    const count = await this.postRepository.getCountByFolderId(folderId);
    const posts = await this.postRepository.findByFolderId(
      folderId,
      offset,
      query.limit,
    );
    return { count, posts };
  }
}
