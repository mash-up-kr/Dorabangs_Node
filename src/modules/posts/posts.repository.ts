import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AIClassification, Post } from '@src/infrastructure';
import { PaginationQuery } from '@src/common';

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
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException('create post DB error');
    }
  }
  async findBySuggestedFolderId(
    userId: string,
    suggestedFolderId: string,
    offset: number,
    limit: number,
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
      .skip(offset)
      .limit(limit)
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
