import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { P001 } from './error';

@Injectable()
export class PostsPGRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPostCount(
    userId: string,
    isFavorite?: boolean,
    isRead?: boolean,
  ) {
    const userPostCount = await this.prisma.post.count({
      where: {
        isFavorite: isFavorite ? true : undefined,
        readAt: isRead
          ? {
              not: null,
            }
          : undefined,
      },
    });
    return userPostCount;
  }

  async listPost(
    userId: string,
    page: number,
    limit: number,
    order = Prisma.SortOrder.desc,
    isFavorite?: boolean,
    isRead?: boolean,
  ) {
    const skip = (page - 1) * limit;
    const posts = await this.prisma.post.findMany({
      skip: skip,
      take: limit,
      where: {
        isFavorite: isFavorite ? true : undefined,
        readAt: isRead
          ? {
              not: null,
            }
          : undefined,
      },
      orderBy: {
        createdAt: order,
      },
    });
    return posts;
  }

  async findPostOrThrow(param: Prisma.PostWhereUniqueInput) {
    const post = await this.prisma.post.findUnique({
      where: {
        ...param,
      },
    });
    if (!post) {
      throw new NotFoundException(P001);
    }
    return post;
  }
}
