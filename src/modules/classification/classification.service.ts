import { Injectable } from '@nestjs/common';
import {
  Folder,
  FolderDocument,
  Post,
  PostAIClassification,
} from '@src/infrastructure/database/schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AIFolderNameServiceDto } from './dto/getAIFolderNameLIst.dto';
import { AIPostServiceDto } from './dto/getAIPostList.dto';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(PostAIClassification.name)
    private postAiClassificationModel: Model<PostAIClassification>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async getFolderNameList(
    userId: Types.ObjectId,
  ): Promise<AIFolderNameServiceDto[]> {
    const folders = await this.folderModel.find({ userId }).exec();
    const folderIds = folders.map((folder) => folder._id);

    const classificationIds = await this.postAiClassificationModel
      .distinct('suggestedFolderId')
      .where('suggestedFolderId')
      .in(folderIds)
      .exec();

    const matchedFolders = await this.folderModel
      .find({ _id: { $in: classificationIds } })
      .exec();

    return matchedFolders.map((folder) => new AIFolderNameServiceDto(folder));
  }

  async getPostList(folderId: string): Promise<AIPostServiceDto[]> {
    const posts = await this.postModel
      .find()
      .populate<{
        aiClassificationId: PostAIClassification;
      }>({
        path: 'aiClassificationId',
        match: { deletedAt: null, suggestedFolderId: folderId },
      })
      .sort({ createdAt: -1 })
      .exec();

    return posts
      .filter((post) => post.aiClassificationId)
      .map((post) => new AIPostServiceDto(post, post.aiClassificationId));
  }
}
