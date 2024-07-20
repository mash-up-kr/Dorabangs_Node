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
import { GetUser } from '@src/common';
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
import { CreateFolderDto, DeleteCustomFolderDto, UpdateFolderDto } from './dto';
import { FoldersService } from './folders.service';
import {
  FolderListResponse,
  FolderSummaryResponse,
  PostListInFolderResponse,
} from './responses';

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
    await this.foldersService.createMany(userId, createFolderDto);
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

    return new PostListInFolderResponse(
      query.page,
      query.limit,
      result.count,
      result.posts,
    );
  }

  @UpdateFolderDocs
  @Patch(':folderId')
  async update(
    @GetUser() userId: string,
    @Param('folderId') folderId: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    await this.foldersService.update(userId, folderId, updateFolderDto);
  }

  @Delete('/all')
  async removeAll(@Query() deleteCustomFolderDto: DeleteCustomFolderDto) {
    await this.postsService.removeAllPostsInCustomFolders(
      deleteCustomFolderDto.userId,
    );
    await this.foldersService.removeAllCustomFolders(
      deleteCustomFolderDto.userId,
    );
  }

  @DeleteFolderDocs
  @Delete(':folderId')
  async remove(@GetUser() userId: string, @Param('folderId') folderId: string) {
    await this.foldersService.remove(userId, folderId);
  }
}
