import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsPGRepository {
  constructor(private readonly prisma: PrismaService) {}

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
    });
    return posts;
  }

  async findPostOrThrow(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        user_id: userId,
      },
    });
    if (!post) {
      throw new NotFoundException('링크를 찾을 수 없습니다.');
    }
    return post;
  }

  async updatePostFolder(userId: string, postId: string, folderId: string) {
    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
        user_id: userId,
      },
      data: {},
    });
  }
}
