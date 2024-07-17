import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostKeyword } from '@src/infrastructure/database/schema/postKeyword.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostKeywordsRepository {
  constructor(
    @InjectModel(PostKeyword.name)
    private readonly postKeywordModel: Model<PostKeyword>,
  ) {}

  async createPostKeywords(postId: string, keywords: string[]) {
    const postKeywords = keywords.map((keyword) => ({
      postId,
      keyword,
    }));

    await this.postKeywordModel.insertMany(postKeywords);
  }
}
