import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { GetUser } from '@src/common';
import { ClassificationControllerDocs, GetAIFolderNameListDocs } from './docs';
import { JwtGuard } from '../users/guards';
import {
  GetAIFolderNameListItem,
  GetAIFolderNameListResponse,
} from './dto/getAIFolderNameLIst.dto';
import { Types } from 'mongoose';

@Controller('ai')
@UseGuards(JwtGuard)
@ClassificationControllerDocs
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get('/suggestions') //TODO : 정렬
  @GetAIFolderNameListDocs
  async getSuggestedFolderNameList(@GetUser('id') userId: Types.ObjectId) {
    const folders = await this.classificationService.getFolderNameList(userId);

    const folderNameList = folders.map(
      (folder) =>
        new GetAIFolderNameListItem({
          id: folder._id.toString(),
          name: folder.name,
        }),
    );

    const response = new GetAIFolderNameListResponse({
      list: folderNameList,
    });

    return response;
  }
  @Get('/suggestions/:folderId')
  @GetAIFolderNameListDocs
  async getSuggestedPostList(@GetUser('id') userId: Types.ObjectId) {
    //await this.classificationService.return;
  }
}
