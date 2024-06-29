import { Injectable } from '@nestjs/common';
import { MutateFolderDto } from './dto/mutate-folder.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder, Post } from '@src/infrastructure';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';
import { FolderWithCount } from './dto/folder-with-count.dto';
import { FolderRepository } from './folders.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class FoldersService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  async create(userId: Types.ObjectId, createFolderDto: MutateFolderDto) {
    const folder = await this.folderRepository.create(
      userId.toString(),
      createFolderDto.name,
    );

    return folder;
  }

  async findAll(userId: Types.ObjectId): Promise<FolderWithCount[]> {
    const folders = await this.folderRepository.findByUserId(userId.toString());
    const folderIds = folders.map((folder) => folder._id.toString());

    const posts = await this.postRepository.getPostCountByFolderIds(folderIds);

    const foldersWithCounts = folders.map((folder) => {
      const postCount = posts.find((post) => post.fold.equals(folder._id));
      return {
        ...folder.toJSON(),
        postCount: postCount ?? 0,
      } satisfies FolderWithCount;
    });

    return foldersWithCounts;
  }

  async findOne(userId: Types.ObjectId, folderId: string) {}

  async update(
    userId: Types.ObjectId,
    folderId: string,
    updateFolderDto: MutateFolderDto,
  ) {}

  async remove(userID: Types.ObjectId, folderId: string) {}
}
