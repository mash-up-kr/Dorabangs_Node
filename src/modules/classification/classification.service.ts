import { Injectable } from '@nestjs/common';
import {
  Folder,
  Post,
  AIClassification,
} from '@src/infrastructure/database/schema';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, Schema, Types } from 'mongoose';
import { AIFolderNameServiceDto } from './dto/getAIFolderNameLIst.dto';
import { AIPostServiceDto } from './dto/getAIPostList.dto';
import { ClassficiationRepository } from './classification.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly classficationRepository: ClassficiationRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  async getFolderNameList(userId: String): Promise<AIFolderNameServiceDto[]> {
    const folders = await this.folderModel.find({ userId }).exec();
    const folderIds = folders.map((folder) => folder._id);

    const classificationIds =
      await this.classficationRepository.findBySuggestedFolderId(folderIds);

    const matchedFolders = await this.folderModel
      .find({ _id: { $in: classificationIds } })
      .exec();

    return matchedFolders.map((folder) => new AIFolderNameServiceDto(folder));
  }

  async getPostList(
    userId: string,
    folderId: string,
  ): Promise<AIPostServiceDto[]> {
    const posts = await this.postRepository.findBySuggestedFolderId(
      userId,
      folderId,
    );

    return posts
      .filter((post) => post.aiClassificationId)
      .map((post) => new AIPostServiceDto(post, post.aiClassificationId));
  }
  async moveAllPostTosuggestionFolder(
    userId: string,
    suggestedFolderId: string,
  ) {
    const postList = await this.postRepository.findBySuggestedFolderId(
      userId,
      suggestedFolderId,
    );

    const filteredPosts = postList.filter((post) => post.aiClassificationId);

    for (const post of filteredPosts) {
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
