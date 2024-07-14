import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PostUpdateableFields } from './types/type';

@Injectable()
export class PostsPGRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async validateUserPost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        user_id: userId,
        id: postId,
      },
      include: {
        classification: true,
      },
    });
    if (!post) {
      throw new NotFoundException('링크를 찾을 수 없습니다.');
    }
    return post;
  }

  // Temporary located. TODO: Migrate to folder.pg.repository.ts
  private async validateUserFolder(userId: string, folderId: string) {
    const folder = await this.prisma.folder.findUnique({
      where: {
        id: folderId,
        user_id: userId,
      },
    });

    if (!folder) {
      throw new NotFoundException('폴더를 찾을 수 없습니다.');
    }
    return folder;
  }

  async getUserPostCount(userId: string) {
    const userPostCount = await this.prisma.post.count({
      where: {
        user_id: userId,
      },
    });
    return userPostCount;
  }

  async listPost(
    userId: string,
    page: number,
    limit: number,
    order: Prisma.SortOrder = 'desc',
    isFavorite?: boolean,
  ) {
    const skipCount = (page - 1) * limit;
    const posts = await this.prisma.post.findMany({
      skip: skipCount,
      take: limit,
      where: {
        user_id: userId,
        is_favorite: isFavorite ?? undefined,
      },
      orderBy: {
        created_at: order,
      },
      include: {
        classification: true,
      },
    });
    return posts;
  }

  async findPostOrThrow(userId: string, postId: string) {
    const post = await this.validateUserPost(userId, postId);
    return post;
  }

  async updatePostFolder(userId: string, postId: string, folderId: string) {
    // Check if folder is user's
    await this.validateUserFolder(userId, folderId);

    // Update folder
    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
        user_id: userId,
      },
      data: {
        folder_id: folderId,
      },
    });
    return updatedPost;
  }

  async createPost(
    userId: string,
    folderId: string,
    url: string,
    title: string,
  ) {
    await this.validateUserFolder(userId, folderId);
    const post = await this.prisma.post.create({
      data: {
        user_id: userId,
        folder_id: folderId,
        url: url,
        title: title,
      },
    });
    return post;
  }

  async updatePost(
    userId: string,
    postId: string,
    updateField: PostUpdateableFields,
  ) {
    await this.validateUserPost(userId, postId);
    const post = await this.prisma.post.update({
      where: {
        id: postId,
        user_id: userId,
      },
      data: {
        ...updateField,
      },
    });
    return post;
  }

  async deletePost(userId: string, postId) {
    await this.validateUserPost(userId, postId);
    const post = await this.prisma.post.delete({
      where: {
        id: postId,
        user_id: userId,
      },
    });
    return post;
  }
}
