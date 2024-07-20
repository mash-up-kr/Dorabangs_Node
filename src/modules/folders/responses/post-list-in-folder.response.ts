import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadata } from '@src/common';
import { PostResponse } from './post.response';

export class FolderPostResponse {
  @ApiProperty({
    type: PaginationMetadata,
  })
  meatadata: PaginationMetadata;

  @ApiProperty({ type: PostResponse, isArray: true })
  list: PostResponse[];

  constructor(metadata: PaginationMetadata, posts: PostResponse[]) {
    this.meatadata = metadata;
    this.list = posts;
  }
}
