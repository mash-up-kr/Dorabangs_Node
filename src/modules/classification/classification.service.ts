import { Injectable } from '@nestjs/common';
import {
  Folder,
  Post,
  AIClassification,
} from '@src/infrastructure/database/schema';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, Schema, Types } from 'mongoose';
import { AIPostServiceDto } from './dto/getAIPostList.dto';
import { ClassficiationRepository } from './classification.repository';
import { PostsRepository } from '../posts/posts.repository';
import { ClassificationFolderWithCount } from './dto/classification.dto';
import { PaginationQuery } from '@src/common';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly classficationRepository: ClassficiationRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  async getFolderNameList(
    userId: string,
  ): Promise<ClassificationFolderWithCount[]> {
    return await this.classficationRepository.findContainedFolderByUserId(
      new Types.ObjectId(userId),
    );
  }

  async getPostList(
    userId: string,
    folderId: string,
    paingQuery: PaginationQuery,
  ): Promise<AIPostServiceDto[]> {
    const offset = (paingQuery.page - 1) * paingQuery.limit;

    const posts = await this.postRepository.findBySuggestedFolderId(
      userId,
      folderId,
      offset,
      paingQuery.limit,
    );

    return posts
      .filter((post) => post.aiClassificationId)
      .map((post) => new AIPostServiceDto(post, post.aiClassificationId));
  }
  async moveAllPostTosuggestionFolder(
    userId: string,
    suggestedFolderId: string,
  ) {
    const postIdList =
      await this.postRepository.findFolderIdsBySuggestedFolderId(
        userId,
        suggestedFolderId,
      );

    for (const post of postIdList) {
      await this.postRepository.updateFolderId(
        post._id.toString(),
        suggestedFolderId,
      );
    }

    await this.classficationRepository.deleteBySuggestedFolderId(
      suggestedFolderId,
    );
  }

  async abortClassification(userId: string, postId: string) {
    const post = await this.postModel.findById(postId).exec();

    await this.classficationRepository.delete(
      post.aiClassificationId.toString(),
    );
  }
}
