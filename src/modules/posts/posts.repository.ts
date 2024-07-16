import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { AIClassification, Post } from '@src/infrastructure';
import {
  ClassificationPostList,
  PostListInClassificationFolder,
} from '../classification/dto/classification.dto';
import { OrderType } from '@src/common';
import { PostUpdateableFields } from './type/type';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(AIClassification.name)
    private readonly aiClassificationModel: Model<AIClassification>,
  ) {}

  async getUserPostCount(userId: string, isFavorite?: boolean) {
    const queryFilter: FilterQuery<Post> = {
      userId: userId,
    };
    if (isFavorite) {
      queryFilter['isFavorite'] = true;
    }
    const userPostCount = await this.postModel.countDocuments(queryFilter);
    return userPostCount;
  }

  async listPost(
    userId: string,
    page: number,
    limit: number,
    isFavorite?: boolean,
    order = OrderType.desc,
  ) {
    // Skip Query
    const skipQuery = (page - 1) * limit;
    const queryFilter: FilterQuery<Post> = {
      userId: userId,
    };
    // If isFavorite is not undefined and is typeof boolean
    if (isFavorite) {
      queryFilter['isFavorite'] = true;
    }
    const posts = await this.postModel
      .find(queryFilter)
      .sort([['createdAt', order === OrderType.desc ? -1 : 1]])
      .skip(skipQuery)
      .limit(limit)
      .lean();
    return posts;
  }

  async findPostOrThrow(userId: string, postId: string) {
    const post = await this.postModel
      .findOne({
        _id: postId,
        userId: userId,
      })
      .lean();
    if (!post) {
      throw new NotFoundException('Post를 찾을 수 없습니다.');
    }
    return post;
  }

  async updatePostFolder(userId: string, postId: string, folderId: string) {
    const updatedPost = await this.postModel
      .updateOne(
        {
          _id: postId,
          userId: userId,
        },
        {
          folderId: folderId,
        },
      )
      .lean();
    return updatedPost;
  }

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

  async updatePost(
    userId: string,
    postId: string,
    updateFields: Partial<PostUpdateableFields>,
  ) {
    const updateResult = await this.postModel
      .updateOne(
        {
          _id: postId,
          userId: userId,
        },
        {
          $set: {
            ...updateFields,
          },
        },
      )
      .exec();

    if (!updateResult.modifiedCount) {
      throw new NotFoundException('Post를 찾을 수 없습니다.');
    }
    return updateResult;
  }

  // 해당 이슈로 인해 임시로 any타입 명시
  // https://github.com/microsoft/TypeScript/issues/42873
  async deletePost(
    userId: string,
    postId: string,
    aiClassificationId?: string,
  ): Promise<any> {
    const deleteResult = await this.postModel
      .deleteOne({
        _id: postId,
        userId: userId,
      })
      .exec();
    // If deletion faild, deletedCount will return 0
    if (!deleteResult.deletedCount) {
      throw new NotFoundException('Post를 찾을 수 없습니다.');
    }
    if (aiClassificationId) {
      await this.aiClassificationModel
        .deleteOne({
          _id: aiClassificationId,
        })
        .exec();
    }
    return deleteResult;
  }
}
