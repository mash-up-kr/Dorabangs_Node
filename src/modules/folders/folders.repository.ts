import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Folder, FolderDocument } from '@src/infrastructure';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';
import { FilterQuery, Model } from 'mongoose';
import { F002 } from './error';

@Injectable()
export class FolderRepository {
  constructor(
    @InjectModel(Folder.name)
    private readonly folderModel: Model<Folder>,
  ) {}

  async create(userId: string, name: string, type: FolderType) {
    const folder = await this.folderModel.create({
      userId,
      name,
      type,
    });

    return folder;
  }

  async createMany(
    folders: { userId: string; name: string; type: FolderType }[],
  ) {
    const createdFolders = await this.folderModel.insertMany(folders);
    return createdFolders;
  }

  async findByUserId(userId: string) {
    const folders = await this.folderModel.find({ userId }).exec();
    return folders;
  }

  async findOneOrFail(param: FilterQuery<FolderDocument>) {
    const folder = await this.folderModel.findOne(param).exec();
    if (!folder) {
      throw new NotFoundException(F002);
    }

    return folder;
  }
}
