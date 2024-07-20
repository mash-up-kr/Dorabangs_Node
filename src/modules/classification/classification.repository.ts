import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AIClassification } from '@src/infrastructure';
import { Model, Types } from 'mongoose';
import { ClassificationFolderWithCount } from './dto/classification.dto';

@Injectable()
export class ClassficiationRepository {
  constructor(
    @InjectModel(AIClassification.name)
    private readonly aiClassificationModel: Model<AIClassification>,
  ) {}

  async findById(classificationId: string) {
    const classification = await this.aiClassificationModel
      .findById(classificationId)
      .exec();
    return classification;
  }

  async getClassificationPostCount(
    userId: string,
    suggestedFolderId?: string,
  ): Promise<number> {
    const result = await this.aiClassificationModel
      .aggregate([
        {
          $match: {
            deletedAt: null,
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'aiClassificationId',
            as: 'post',
          },
        },
        {
          $unwind: '$post',
        },
        {
          $match: {
            'post.userId': new Types.ObjectId(userId),
            ...(suggestedFolderId && {
              suggestedFolderId: new Types.ObjectId(suggestedFolderId),
            }),
          },
        },
        {
          $count: 'count',
        },
      ])
      .exec();

    const count = result[0]?.count || 0;
    return count;
  }

  async createClassification(
    url: string,
    description: string,
    keywords: string[],
    suggestedFolderId: string,
  ) {
    const classification = await this.aiClassificationModel.create({
      suggestedFolderId: suggestedFolderId,
      url: url,
      description: description,
      keywords: keywords,
      completedAt: new Date(),
    });
    return classification;
  }

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
            'folder.type': { $ne: 'default' },
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
