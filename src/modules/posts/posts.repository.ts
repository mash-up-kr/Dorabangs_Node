import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '@src/infrastructure';

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

  async getPostCountByFolderIds(folderIds: string[]) {
    const p = await this.postModel.find({ folderId: { $in: folderIds } });

    const posts = await this.postModel
      .aggregate([
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
}
