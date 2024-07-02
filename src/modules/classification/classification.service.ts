import { Injectable } from '@nestjs/common';
import {
  Folder,
  Post,
  AIClassification,
} from '@src/infrastructure/database/schema';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, Schema, Types } from 'mongoose';
import { AIFolderNameServiceDto } from './dto/getAIFolderNameLIst.dto';
import { AIPostServiceDto } from './dto/getAIPostList.dto';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(AIClassification.name)
    private postAiClassificationModel: Model<AIClassification>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async getFolderNameList(userId: String): Promise<AIFolderNameServiceDto[]> {
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

  async getPostList(
    userId: string,
    folderId: string,
  ): Promise<AIPostServiceDto[]> {
    const posts = await this.postModel
      .find({ userId: userId })
      .populate<{
        aiClassificationId: AIClassification;
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
  async moveAllPostTosuggestionFolder(suggestedFolderId: string) {
    const postList = await this.postModel
      .find()
      .populate<{
        aiClassificationId: AIClassification;
      }>({
        path: 'aiClassificationId',
        match: {
          suggestedFolderId: suggestedFolderId,
          deletedAt: null,
        },
      })
      .exec();

    const filteredPosts = postList.filter((post) => post.aiClassificationId);

    for (const post of filteredPosts) {
      await post.updateOne({ folderId: suggestedFolderId }).exec();
    }

    await this.postAiClassificationModel
      .updateMany(
        { suggestedFolderId: suggestedFolderId, deletedAt: null },
        { $set: { deletedAt: new Date() } },
      )
      .exec();
  }
}
