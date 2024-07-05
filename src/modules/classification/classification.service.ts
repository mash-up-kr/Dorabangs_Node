import { Injectable } from '@nestjs/common';
import {
  Folder,
  Post,
  AIClassification,
} from '@src/infrastructure/database/schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassficiationRepository } from './classification.repository';
import { PostsRepository } from '../posts/posts.repository';
import {
  ClassificationFolderWithCount,
  PostListInClassificationFolder,
} from './dto/classification.dto';
import { PaginationQuery } from '@src/common';
import { PostListInFolderResponse } from '../folders/responses';

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

  async getPostList(userId: string, paingQuery: PaginationQuery) {
    const orderedFolderIdList = await this.getFolderOrder(userId);

    const offset = (paingQuery.page - 1) * paingQuery.limit;
    return await this.postRepository.findAndSortBySuggestedFolderIds(
      new Types.ObjectId(userId),
      orderedFolderIdList,
      offset,
      paingQuery.limit,
    );
  }

  async getFolderOrder(userId: string) {
    const orderedFolderList =
      await this.classficationRepository.findContainedFolderByUserId(
        new Types.ObjectId(userId),
      );

    return orderedFolderList.map(
      (folder) => new Types.ObjectId(folder.folderId),
    );
  }

  async getPostListInFolder(
    userId: string,
    folderId: string,
    paingQuery: PaginationQuery,
  ): Promise<PostListInClassificationFolder[]> {
    const offset = (paingQuery.page - 1) * paingQuery.limit;

    return await this.postRepository.findBySuggestedFolderId(
      userId,
      new Types.ObjectId(folderId),
      offset,
      paingQuery.limit,
    );
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
