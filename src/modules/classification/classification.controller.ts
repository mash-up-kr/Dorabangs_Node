import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { GetUser, PaginationMetadata, PaginationQuery } from '@src/common';
import {
  ClassificationControllerDocs,
  GetAIFolderNameListDocs,
  GetAIPostListDocs,
  DeleteAIClassificationDocs,
  PatchAIPostDocs,
  PatchAIPostListDocs,
} from './docs';
import { JwtGuard } from '../users/guards';
import { AIFolderNameListResponse } from './response/ai-folder-list.dto';
import { AIPostListResponse } from './response/ai-post-list.dto';
import { UpdateAIClassificationDto } from './dto/classification.dto';

@Controller('classification')
@UseGuards(JwtGuard)
@ClassificationControllerDocs
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get('/folders')
  @GetAIFolderNameListDocs
  async getSuggestedFolderNameList(@GetUser() userId: string) {
    const folders = await this.classificationService.getFolderNameList(userId);

    return new AIFolderNameListResponse(folders);
  }
  @Get('/posts')
  @GetAIPostListDocs
  async getSuggestedPostList(
    @GetUser() userId: string,
    @Query() pagingQuery: PaginationQuery,
  ) {
    const { count, classificationPostList } =
      await this.classificationService.getPostList(userId, pagingQuery);

    const metadata = new PaginationMetadata(
      pagingQuery.page,
      pagingQuery.limit,
      count,
    );

    return new AIPostListResponse(metadata, classificationPostList);
  }
  @Get('/posts/:folderId')
  @GetAIPostListDocs
  async getSuggestedPostListInFolder(
    @GetUser() userId: string,
    @Param('folderId') folderId: string,
    @Query() pagingQuery: PaginationQuery,
  ) {
    const { count, classificationPostList } =
      await this.classificationService.getPostListInFolder(
        userId,
        folderId,
        pagingQuery,
      );

    const metadata = new PaginationMetadata(
      pagingQuery.page,
      pagingQuery.limit,
      count,
    );

    return new AIPostListResponse(metadata, classificationPostList);
  }
  @Patch('/posts')
  @PatchAIPostListDocs
  async moveAllPost(
    @GetUser() userId: string,
    @Query('suggestionFolderId') suggestionFolderId: string,
  ) {
    await this.classificationService.moveAllPostTosuggestionFolder(
      userId,
      suggestionFolderId,
    );
  }

  @Patch('/posts/:postId')
  @PatchAIPostDocs
  async moveOnePost(
    @GetUser() userId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdateAIClassificationDto,
  ) {
    await this.classificationService.moveOnePostTosuggestionFolder(
      userId,
      postId,
      dto.suggestionFolderId,
    );
  }

  @Delete('/posts/:postId')
  @DeleteAIClassificationDocs
  async abortClassification(
    @GetUser() userId: string,
    @Param('postId') postId: string,
  ) {
    await this.classificationService.abortClassification(userId, postId);
  }
}
