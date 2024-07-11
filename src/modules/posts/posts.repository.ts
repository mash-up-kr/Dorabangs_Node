import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostSchema } from '@src/infrastructure';
import { PaginationQuery } from '@src/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async readPost(
    userId: string,
    paginationQuery: PaginationQuery,
    isFavorite?: boolean,
  ): Promise<Post[]> {
    const offset = (paginationQuery.page - 1) * paginationQuery.limit;
    let query = this.postModel
      .find({ userId })
      .skip(offset)
      .limit(paginationQuery.limit);
    if (isFavorite !== null) {
      query = query.where({ isFavorite: isFavorite });
    }
    const post_list = await query.lean().exec();
    return post_list;
  }

  async readPostCount(
    userId: string,
    paginationQuery: PaginationQuery,
    isFavorite?: boolean,
  ): Promise<number> {
    const offset = (paginationQuery.page - 1) * paginationQuery.limit;
    let query = this.postModel.find({ userId });

    if (isFavorite !== null) {
      query = query.where({ isFavorite: isFavorite });
    }
    const count = await query.countDocuments();
    return count;
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
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException('create post DB error');
    }
  }

  async getPostCountByFolderIds(folderIds: Types.ObjectId[]) {
    const posts = await this.postModel
      .aggregate<{ _id: Types.ObjectId; count: number }>([
        {
          $match: {
            folderId: { $in: folderIds },
          },
        },
        {
          $group: {
            _id: '$folderId',
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    return posts;
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
}
