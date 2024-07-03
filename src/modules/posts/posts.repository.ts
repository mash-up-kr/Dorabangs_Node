import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Post } from '@src/infrastructure';
import { OrderType } from '@src/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getUserPostCount(userId: string) {
    const userPostCount = await this.postModel.countDocuments({
      userId: userId,
    });
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
    if (isFavorite !== undefined && typeof isFavorite === 'boolean') {
      queryFilter['isFavorite'] = isFavorite;
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
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException('create post DB error');
    }
  }

  async deletePost(userId: string, postId: string) {
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
    return deleteResult;
  }
}
