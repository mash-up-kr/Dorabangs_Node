import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AIClassification, Post } from '@src/infrastructure';
import {
  ClassificationPostList,
  PostListInClassificationFolder,
} from '../classification/dto/classification.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(
    userId: string,
    folderId: string,
    url: string,
    title: string,
  ): Promise<boolean> {
    try {
      await this.postModel.create({
        folderId: folderId,
        url: url,
        title: title,
        userId: userId,
        readAt: null,
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException('create post DB error');
    }
  }

  async getPostCountByFolderIds(folderIds: Types.ObjectId[]) {
    const folders = await this.postModel.aggregate<{
      _id: Types.ObjectId;
      count: number;
    }>([
      {
        $match: {
          folderId: { $in: folderIds },
        },
      },
      {
        $group: {
          _id: '$folderId',
          postCount: { $sum: 1 },
        },
      },
    ]);

    return folders;
  }

  async findBySuggestedFolderId(
    userId: string,
    suggestedFolderId: Types.ObjectId,
    offset: number,
    limit: number,
  ): Promise<PostListInClassificationFolder[]> {
    return await this.postModel
      .aggregate([
        {
          $match: { userId: new Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'ai_classifications',
            localField: 'aiClassificationId',
            foreignField: '_id',
            as: 'aiClassification',
          },
        },
        {
          $unwind: '$aiClassification',
        },
        {
          $match: {
            'aiClassification.deletedAt': null,
            'aiClassification.suggestedFolderId': suggestedFolderId,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 0,
            postId: { $toString: '$_id' },
            title: 1,
            url: 1,
            description: 1,
            createdAt: 1,
            isRead: 1,
            'aiClassification.keywords': 1,
          },
        },
      ])
      .exec();
  }

  async getCountByFolderId(folderId: string) {
    const count = await this.postModel.countDocuments({ folderId });

    return count;
  }

  async findByFolderId(folderId: string, offset: number, limit: number) {
    const folders = await this.postModel
      .find({ folderId })
      .skip(offset)
      .limit(limit);

    return folders;
  }

  async findFavoritePostCount(userId: string) {
    const count = await this.postModel.countDocuments({
      userId,
      isFavorite: true,
    });

    return count;
  }

  async findAndSortBySuggestedFolderIds(
    userId: Types.ObjectId,
    suggestedFolderIds: Types.ObjectId[],
    offset: number,
    limit: number,
  ): Promise<ClassificationPostList[]> {
    return await this.postModel
      .aggregate([
        {
          $match: { userId: new Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'ai_classifications',
            localField: 'aiClassificationId',
            foreignField: '_id',
            as: 'aiClassification',
          },
        },
        {
          $unwind: '$aiClassification',
        },
        {
          $match: {
            'aiClassification.deletedAt': null,
            'aiClassification.suggestedFolderId': {
              $in: suggestedFolderIds,
            },
          },
        },
        {
          $addFields: {
            order: {
              $indexOfArray: [
                suggestedFolderIds,
                '$aiClassification.suggestedFolderId',
              ],
            },
          },
        },
        {
          $sort: {
            order: 1,
            createdAt: -1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 0,
            postId: { $toString: '$_id' },
            title: 1,
            url: 1,
            description: 1,
            createdAt: 1,
            isRead: 1,
            'aiClassification.keywords': 1,
          },
        },
      ])
      .exec();
  }

  async findFolderIdsBySuggestedFolderId(
    userId: string,
    suggestedFolderId: string,
  ) {
    return await this.postModel
      .find({ userId: userId })
      .populate<{
        aiClassificationId: AIClassification;
      }>({
        path: 'aiClassificationId',
        match: { deletedAt: null, suggestedFolderId: suggestedFolderId },
      })
      .sort({ createdAt: -1 })
      .select('_id')
      .exec();
  }

  async updateFolderId(postId: string, suggestedFolderId: string) {
    await this.postModel
      .updateOne({ _id: postId }, { $set: { folderId: suggestedFolderId } })
      .exec();
  }
}
