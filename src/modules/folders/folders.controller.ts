import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
import { FolderSummaryResponse } from './responses';
import { JwtGuard } from '../users/guards';

@FolderControllerDocs
@UseGuards(JwtGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @CreateFolderDocs
  @Post()
  async create(
    @GetUser('id') userId: Types.ObjectId,
    @Body() createFolderDto: MutateFolderDto,
  ) {
    await this.foldersService.create(userId, createFolderDto);
    return true;
  }

  @FindAFolderListDocs
  @Get()
  async findAll(@GetUser() userId: Types.ObjectId) {
    const folders = await this.foldersService.findAll(userId);
    return folders;
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
