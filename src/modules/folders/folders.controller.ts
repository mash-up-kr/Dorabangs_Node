import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { MutateFolderDto } from './dto';
import { GetUser } from '@src/common';
import {
  CreateFolderDocs,
  DeleteFolderDocs,
  FindAFolderListDocs,
  FindFolderDocs,
  FindLinksInFolderDocs,
  FolderControllerDocs,
  UpdateFolderDocs,
} from './docs';
import { Types } from 'mongoose';

@FolderControllerDocs
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @CreateFolderDocs
  @Post()
  async create(
    @GetUser() userId: Types.ObjectId,
    @Body() createFolderDto: MutateFolderDto,
  ) {
    const folder = await this.foldersService.create(userId, createFolderDto);

    return folder;
  }

  @FindAFolderListDocs
  @Get()
  async findAll(@GetUser() userId: Types.ObjectId) {
    return await this.foldersService.findAll(userId);
  }

  @FindFolderDocs
  @Get(':folderId')
  async findOne(
    @GetUser() userId: Types.ObjectId,
    @Param('folderId') folderId: string,
  ) {
    return this.foldersService.findOne(userId, folderId);
  }

  @FindLinksInFolderDocs
  @Get(':folderId/posts')
  async findLinksInFolder(
    @GetUser() userId: Types.ObjectId,
    @Param('folderId') folderId: string,
  ) {
    return this.foldersService.findOne(userId, folderId);
  }

  @UpdateFolderDocs
  @Patch(':folderId')
  async update(
    @GetUser() userId: Types.ObjectId,
    @Param('folderId') folderId: string,
    @Body() updateFolderDto: MutateFolderDto,
  ) {
    return this.foldersService.update(userId, folderId, updateFolderDto);
  }

  @DeleteFolderDocs
  @Delete(':folderId')
  async remove(
    @GetUser() userId: Types.ObjectId,
    @Param('folderId') folderId: string,
  ) {
    return this.foldersService.remove(userId, folderId);
  }
}
