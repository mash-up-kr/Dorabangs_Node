import { Injectable, NotFoundException } from '@nestjs/common';
import { MutateFolderDto } from './dto/mutate-folder.dto';
import { Types } from 'mongoose';
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
    const folderIds = folders.map((folder) => folder._id);

    const posts = await this.postRepository.getPostCountByFolderIds(folderIds);

    const foldersWithCounts = folders.map((folder) => {
      const post = posts.find((post) => post._id.equals(folder._id));
      return {
        ...folder.toJSON(),
        postCount: post?.count ?? 0,
      } satisfies FolderWithCount;
    });

    return foldersWithCounts;
  }

  async findOne(userId: Types.ObjectId, folderId: string) {
    const folder = await this.folderRepository.findOne({
      _id: folderId,
      userId,
    });

    return folder;
  }

  async update(
    userId: Types.ObjectId,
    folderId: string,
    updateFolderDto: MutateFolderDto,
  ) {
    const folder = await this.folderRepository.findOne({
      _id: folderId,
      userId,
    });
    if (!folder) {
      throw new NotFoundException('folder not found');
    }

    folder.name = updateFolderDto.name;
    await folder.save();
  }

  async remove(userId: Types.ObjectId, folderId: string) {
    const folder = await this.folderRepository.findOne({
      userId,
      _id: folderId,
    });
    if (!folder) {
      throw new NotFoundException('folder not found');
    }

    await folder.deleteOne().exec();
  }
}
