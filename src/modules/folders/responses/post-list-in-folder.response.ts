import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadata } from '@src/common';
import { Keyword, Post } from '@src/infrastructure';
import { Types } from 'mongoose';
import { PostResponse } from './post.response';

export class PostListInFolderResponse extends PaginationMetadata {
  @ApiProperty({ type: PostResponse, isArray: true })
  list: PostResponse[];

  constructor(
    page: number,
    limit: number,
    total: number,
    list: (Post & {
      _id: Types.ObjectId;
      keywords: (Keyword & { _id: Types.ObjectId })[];
    })[],
  ) {
    super(page, limit, total);

    this.list = list.map((post) => new PostResponse(post));
  }
}
