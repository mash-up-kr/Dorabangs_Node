import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder } from '@src/infrastructure';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';

@Injectable()
export class FolderRepository {
  constructor(
    @InjectModel(Folder.name) private readonly folderModel: Model<Folder>,
  ) {}

  async create(userId: string, name: string, type = FolderType.CUSTOM) {
    const folder = await this.folderModel.create({
      userId,
      name,
      type,
    });

    return folder;
  }

  async findByUserId(userId: string) {
    try {
      const folders = await this.folderModel.find({ userId }).exec();
      return folders;
    } catch (error) {
      throw new InternalServerErrorException('get folder list DB error');
    }
  }
}
