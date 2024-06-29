import { Injectable } from '@nestjs/common';
import { MutateFolderDto } from './dto/mutate-folder.dto';
import { Types } from 'mongoose';

@Injectable()
export class FoldersService {
  async create(userId: Types.ObjectId, createFolderDto: MutateFolderDto) {}

  async findAll(userId: Types.ObjectId) {}

  async findOne(userId: Types.ObjectId, folderId: string) {}

  async update(
    userId: Types.ObjectId,
    folderId: string,
    updateFolderDto: MutateFolderDto,
  ) {}

  async remove(userID: Types.ObjectId, folderId: string) {}
}
