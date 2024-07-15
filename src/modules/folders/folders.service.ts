import { Injectable } from '@nestjs/common';
import { CreateFolderDto, UpdateFolderDto } from './dto/mutate-folder.dto';
import { Schema as MongooseSchema } from 'mongoose';
import { FolderRepository } from './folders.repository';
import { PostsRepository } from '../posts/posts.repository';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';
import { sum } from '@src/common';
import { FolderListServiceDto } from './dto/folder-with-count.dto';
import { Folder, FolderDocument } from '@src/infrastructure';

@Injectable()
export class FoldersService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  async createMany(userId: string, createFolderDto: CreateFolderDto) {
    const folders = createFolderDto.names.map((name) => ({
      userId: userId,
      name,
      type: FolderType.CUSTOM,
    }));

    await this.folderRepository.createMany(folders);
  }

  async findAll(userId: string): Promise<FolderListServiceDto> {
    const folders = await this.folderRepository.findByUserId(userId);
    const folderIds = folders.map((folder) => folder._id);

    const groupedFolders =
      await this.postRepository.getPostCountByFolderIds(folderIds);

    const allPostCount = sum(groupedFolders, (folder) => folder.count);
    const favoritePostCount =
      await this.postRepository.findFavoritePostCount(userId);

    const defaultFolder = folders.find(
      (folder) => folder.type === FolderType.DEFAULT,
    );
    const customFolders = folders
      .filter((folder) => folder.type === FolderType.CUSTOM)
      .map((folder) => {
        const post = groupedFolders.find((folder) =>
          folder._id.equals(folder._id),
        );
        return {
          ...folder.toJSON(),
          postCount: post?.count ?? 0,
        };
      });

    const all = {
      id: null,
      name: '모든 링크',
      type: FolderType.ALL,
      userId: new MongooseSchema.Types.ObjectId(userId),
      postCount: allPostCount,
    };
    const favorite = {
      id: null,
      name: '즐겨찾기',
      type: FolderType.FAVORITE,
      userId: new MongooseSchema.Types.ObjectId(userId),
      postCount: favoritePostCount,
    };

    const defaultFolders = [all, favorite, defaultFolder].filter(
      (folder) => !!folder,
    );
    return { defaultFolders, customFolders };
  }

  async findOne(userId: string, folderId: string) {
    const folder = await this.folderRepository.findOneOrFail({
      _id: folderId,
      userId,
    });

    return folder;
  }

  async update(
    userId: string,
    folderId: string,
    updateFolderDto: UpdateFolderDto,
  ) {
    const folder = await this.folderRepository.findOneOrFail({
      _id: folderId,
      userId,
    });

    folder.name = updateFolderDto.name;
    await folder.save();
  }

  async remove(userId: string, folderId: string) {
    const folder = await this.folderRepository.findOneOrFail({
      userId,
      _id: folderId,
    });

    await folder.deleteOne().exec();
  }
}
