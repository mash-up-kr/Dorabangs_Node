import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Schema } from 'mongoose';
import { AIClassification, Folder } from '@src/infrastructure';
import { ClassificationFolderWithCount } from './dto/classification.dto';

@Injectable()
export class ClassficiationRepository {
  constructor(
    @InjectModel(AIClassification.name)
    private readonly aiClassificationModel: Model<AIClassification>,
  ) {}

  async findContainedFolderByUserId(
    userId: Types.ObjectId,
  ): Promise<ClassificationFolderWithCount[]> {
    return await this.aiClassificationModel
      .aggregate([
        {
          $match: {
            deletedAt: null,
          },
        },
        {
          $lookup: {
            from: 'folders',
            localField: 'suggestedFolderId',
            foreignField: '_id',
            as: 'folder',
          },
        },
        {
          $unwind: '$folder',
        },
        {
          $match: {
            'folder.userId': userId,
          },
        },
        {
          $group: {
            _id: '$suggestedFolderId',
            folderName: { $first: '$folder.name' },
            postCount: { $sum: 1 },
            folderCreatedAt: { $first: '$folder.createdAt' },
          },
        },
        {
          $sort: {
            postCount: -1,
            folderCreatedAt: -1,
          },
        },
        {
          $project: {
            _id: 0,
            folderId: { $toString: '$_id' },
            folderName: 1,
            postCount: 1,
          },
        },
      ])
      .exec();
  }

  async delete(id: string) {
    await this.aiClassificationModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();
  }

  async deleteBySuggestedFolderId(suggestedFolderId: string) {
    await this.aiClassificationModel
      .updateMany(
        { suggestedFolderId: suggestedFolderId, deletedAt: null },
        { $set: { deletedAt: new Date() } },
      )
      .exec();
  }
}