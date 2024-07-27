import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
