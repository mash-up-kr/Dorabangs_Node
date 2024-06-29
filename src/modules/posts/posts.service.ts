import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { GetPostQueryDto } from './dto/find-in-folder.dto';
import { Types } from 'mongoose';
import { FolderRepository } from '../folders/folders.repository';

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

  async findByFolderId(
    userId: Types.ObjectId,
    folderId: string,
    query: GetPostQueryDto,
  ) {
    await this.folderRepository.findOneOrFail({
      _id: folderId,
      userId,
    });

    const offset = (query.page - 1) * query.limit;
    const count = await this.postRepository.getCount(folderId);
    const posts = await this.postRepository.findByFolderId(
      folderId,
      offset,
      query.limit,
    );

    return { count, posts };
  }
}
