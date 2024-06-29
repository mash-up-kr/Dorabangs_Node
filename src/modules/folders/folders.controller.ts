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
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.create(createFolderDto);
  }

  @Get()
  findAll() {
    return this.foldersService.findAll();
  }

  @Get(':folderId')
  findOne(@Param('id') id: string) {
    return this.foldersService.findOne(+id);
  }

  @Get(':folderId/posts')
  findLinksInFolder(@Param('id') id: string) {
    return this.foldersService.findOne(+id);
  }

  @Patch(':folderId')
  update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    return this.foldersService.update(+id, updateFolderDto);
  }

  @Delete(':folderId')
  remove(@Param('id') id: string) {
    return this.foldersService.remove(+id);
  }
}
