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
import { ClassificationFolderWithCount } from './dto/classification.dto';

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
