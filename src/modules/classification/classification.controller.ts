import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { GetUser, PaginationQuery } from '@src/common';
import {
  ClassificationControllerDocs,
  GetAIFolderNameListDocs,
  GetAIPostListDocs,
  DeleteAIClassificationDocs,
  PatchAIPostDocs,
} from './docs';
import { JwtGuard } from '../users/guards';
import { AIFolderNameListResponse } from './response/ai-folder-list.dto';
import { AIPostListResponse } from './response/ai-post-list.dto';

@Controller('classification')
@UseGuards(JwtGuard)
@ClassificationControllerDocs
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get('/count')
  async countClassifiedPost(@GetUser() userId: string) {
    const count = await this.classificationService.countClassifiedPost(userId);
    return count;
  }

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
    @Query() paingQuery: PaginationQuery,
  ) {
    const posts = await this.classificationService.getPostList(
      userId,
      paingQuery,
    );

    return new AIPostListResponse(posts);
  }
  @Get('/posts/:folderId')
  @GetAIPostListDocs
  async getSuggestedPostListInFolder(
    @GetUser() userId: string,
    @Param('folderId') folderId: string,
    @Query() paingQuery: PaginationQuery,
  ) {
    const posts = await this.classificationService.getPostListInFolder(
      userId,
      folderId,
      paingQuery,
    );

    return new AIPostListResponse(posts);
  }
  @Patch('/posts')
  @PatchAIPostDocs
  async moveAllPost(
    @GetUser() userId: string,
    @Query('suggestionFolderId') suggestionFolderId: string,
  ) {
    await this.classificationService.moveAllPostTosuggestionFolder(
      userId,
      suggestionFolderId,
    );
  }

  @Delete('/posts/:postId')
  @DeleteAIClassificationDocs
  async abortClassification(
    @GetUser() userId: string,
    @Query('postId') postId: string,
  ) {
    await this.classificationService.abortClassification(userId, postId);
  }
}
