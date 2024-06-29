import { Injectable } from '@nestjs/common';
import { MutateFolderDto } from './dto/mutate-folder.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder, Post } from '@src/infrastructure';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name) private readonly folderModel: Model<Folder>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}
  async create(userId: Types.ObjectId, createFolderDto: MutateFolderDto) {
    const folder = await this.folderModel.create({
      userId,
      name: createFolderDto.name,
      type: FolderType.CUSTOM,
    });

    return folder;
  }

  async findAll(userId: Types.ObjectId) {}

  async findOne(userId: Types.ObjectId, folderId: string) {}

  async update(
    userId: Types.ObjectId,
    folderId: string,
    updateFolderDto: MutateFolderDto,
  ) {}

  async remove(userID: Types.ObjectId, folderId: string) {}
}
