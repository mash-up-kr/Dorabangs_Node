import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { PaginationQuery } from '@src/common';
import { sum } from '@src/common';
import { PostsRepository } from '../posts/posts.repository';
import { ClassficiationRepository } from './classification.repository';
import { ClassificationFolderWithCount } from './dto/classification.dto';
import { C001 } from './error';

@Injectable()
export class ClassificationService {
  constructor(
    private readonly classficationRepository: ClassficiationRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  async countClassifiedPost(userId: string) {
    const count =
      await this.classficationRepository.countClassifiedPostByUserId(userId);
    return count;
  }

  async getFolderNameList(
    userId: string,
  ): Promise<ClassificationFolderWithCount[]> {
    return await this.classficationRepository.findContainedFolderByUserId(
      new Types.ObjectId(userId),
    );
  }

  async getPostList(userId: string, paingQuery: PaginationQuery) {
    const { count, orderedFolderIdList } =
      await this.getFolderCountAndOrder(userId);

    const offset = (paingQuery.page - 1) * paingQuery.limit;
    const classificationPostList =
      await this.postRepository.findAndSortBySuggestedFolderIds(
        new Types.ObjectId(userId),
        orderedFolderIdList,
        offset,
        paingQuery.limit,
      );

    return { count, classificationPostList };
  }

  async getFolderCountAndOrder(userId: string) {
    const orderedFolderList =
      await this.classficationRepository.findContainedFolderByUserId(
        new Types.ObjectId(userId),
      );

    const count = sum(orderedFolderList, (folder) => folder.postCount);
    const orderedFolderIdList = orderedFolderList.map(
      (folder) => new Types.ObjectId(folder.folderId),
    );

    return { count, orderedFolderIdList };
  }

  async getPostListInFolder(
    userId: string,
    folderId: string,
    paingQuery: PaginationQuery,
  ) {
    const offset = (paingQuery.page - 1) * paingQuery.limit;

    const [count, classificationPostList] = await Promise.all([
      this.classficationRepository.getClassificationPostCount(userId, folderId),
      this.postRepository.findBySuggestedFolderId(
        userId,
        new Types.ObjectId(folderId),
        offset,
        paingQuery.limit,
      ),
    ]);

    return { count, classificationPostList };
  }

  async moveAllPostTosuggestionFolder(
    userId: string,
    suggestedFolderId: string,
  ) {
    const postIdList = (
      await this.postRepository.findFolderIdsBySuggestedFolderId(
        userId,
        suggestedFolderId,
      )
    ).map((post) => post._id.toString());

    await this.postRepository.updatePostListFolder(
      userId,
      postIdList,
      suggestedFolderId,
    );

    await this.classficationRepository.deleteBySuggestedFolderId(
      suggestedFolderId,
    );
  }

  async moveAllPostTosuggestionFolderV2(
    userId: string,
    suggestedFolderId: string,
  ) {
    const targetClassificationIds =
      await this.classficationRepository.getClassificationBySuggestedFolderId(
        suggestedFolderId,
      );
    const targetPostIds =
      await this.postRepository.findPostsBySuggestedFolderIds(
        userId,
        targetClassificationIds,
      );
    await this.postRepository.updatePostListFolder(
      userId,
      targetPostIds,
      suggestedFolderId,
    );
    await this.classficationRepository.deleteBySuggestedFolderId(
      suggestedFolderId,
    );
    return true;
  }

  async moveOnePostTosuggestionFolder(
    userId: string,
    postId: string,
    suggestedFolderId: string,
  ) {
    const post = await this.postRepository.findAndupdateFolderId(
      userId,
      postId,
      suggestedFolderId,
    );
    await this.classficationRepository.delete(
      post.aiClassificationId.toString(),
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

  async deleteClassificationBySuggestedFolderId(
    suggestedFolderId: string[] | string,
  ): Promise<boolean> {
    return await this.classficationRepository.deleteManyBySuggestedFolderIdList(
      suggestedFolderId,
    );
  }
}
