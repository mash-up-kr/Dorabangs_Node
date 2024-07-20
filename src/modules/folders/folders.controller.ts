import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser, PaginationMetadata } from '@src/common';
import { GetPostQueryDto } from '../posts/dto/find-in-folder.dto';
import { PostsService } from '../posts/posts.service';
import { JwtGuard } from '../users/guards';
import {
  CreateFolderDocs,
  DeleteFolderDocs,
  FindAFolderListDocs,
  FindFolderDocs,
  FindLinksInFolderDocs,
  FolderControllerDocs,
  UpdateFolderDocs,
} from './docs';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import { FoldersService } from './folders.service';
import {
  FolderListResponse,
  FolderPostResponse,
  FolderResponse,
  FolderSummaryResponse,
} from './responses';
import { PostResponse } from './responses/post.response';

@FolderControllerDocs
@UseGuards(JwtGuard)
@Controller('folders')
export class FoldersController {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly postsService: PostsService,
  ) {}

  @CreateFolderDocs
  @Post()
  async create(
    @GetUser('id') userId: string,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    const folders = await this.foldersService.createMany(
      userId,
      createFolderDto,
    );
    const folderSerializer = folders.map(
      (folder) => new FolderResponse(folder),
    );
    return {
      list: folderSerializer,
    };
  }

  @FindAFolderListDocs
  @Get()
  async findAll(@GetUser() userId: string) {
    const result = await this.foldersService.findAll(userId);
    return new FolderListResponse(result);
  }

  @FindFolderDocs
  @Get(':folderId')
  async findOne(
    @GetUser() userId: string,
    @Param('folderId') folderId: string,
  ) {
    const folder = await this.foldersService.findOne(userId, folderId);
    return new FolderSummaryResponse(folder);
  }

  @FindLinksInFolderDocs
  @Get(':folderId/posts')
  async findLinksInFolder(
    @GetUser() userId: string,
    @Param('folderId') folderId: string,
    @Query() query: GetPostQueryDto,
  ) {
    const result = await this.postsService.findByFolderId(
      userId,
      folderId,
      query,
    );

    const metadata = new PaginationMetadata(
      query.page,
      query.limit,
      result.count,
    );
    const posts = result.posts.map((post) => new PostResponse(post));
    return new FolderPostResponse(metadata, posts);
  }

  @UpdateFolderDocs
  @Patch(':folderId')
  async update(
    @GetUser() userId: string,
    @Param('folderId') folderId: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    const updatedFolder = await this.foldersService.update(
      userId,
      folderId,
      updateFolderDto,
    );
    return new FolderResponse(updatedFolder);
  }

  @DeleteFolderDocs
  @Delete(':folderId')
  async remove(@GetUser() userId: string, @Param('folderId') folderId: string) {
    await this.foldersService.remove(userId, folderId);
  }
}
