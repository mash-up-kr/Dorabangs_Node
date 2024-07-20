import { BadRequestException, Injectable } from '@nestjs/common';

import { PaginationQuery } from '@src/common';
import { Types } from 'mongoose';
import { PostsRepository } from '../posts/posts.repository';
import { ClassficiationRepository } from './classification.repository';
import {
  ClassificationFolderWithCount,
  PostListInClassificationFolder,
} from './dto/classification.dto';
import { C001 } from './error';

@Injectable()
export class ClassificationService {
  constructor(
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
    const post = await this.postRepository.findPostOrThrow({
      _id: postId,
    });

    if (!post.aiClassificationId) {
      throw new BadRequestException(C001);
    }

    const classification = await this.classficationRepository.findById(
      post.aiClassificationId.toString(),
    );
    if (!classification) {
      throw new BadRequestException(C001);
    }

    return await this.classficationRepository.delete(
      post.aiClassificationId.toString(),
    );
  }
}
