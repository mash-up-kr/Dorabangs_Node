import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { GetUser } from '@src/common';
import {
  ClassificationControllerDocs,
  GetAIFolderNameListDocs,
  GetAIPostListDocs,
} from './docs';
import { JwtGuard } from '../users/guards';
import { AIFolderNameListResponse } from './response/ai-folder-list.dto';
import { AIPostListResponse } from './response/ai-post-list.dto';
import { PatchAIPostDocs } from './docs/patchAIPost.docs';

@Controller('classification')
@UseGuards(JwtGuard)
@ClassificationControllerDocs
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get('/suggestions') //TODO : 정렬
  @GetAIFolderNameListDocs
  async getSuggestedFolderNameList(@GetUser() userId: String) {
    const folderNames =
      await this.classificationService.getFolderNameList(userId);

    return new AIFolderNameListResponse(folderNames);
  }

  @Get('/suggestions/:folderId')
  @GetAIPostListDocs
  async getSuggestedPostList(
    @GetUser() userId: string,
    @Param('folderId') folderId: string,
  ) {
    const posts = await this.classificationService.getPostList(
      userId,
      folderId,
    );

    return new AIPostListResponse(posts);
  }
  @Patch('/posts')
  @PatchAIPostDocs
  async moveAllPost(@Query('suggestionFolderId') suggestionFolderId: string) {
    await this.classificationService.moveAllPostTosuggestionFolder(
      suggestionFolderId,
    );
  }
}
