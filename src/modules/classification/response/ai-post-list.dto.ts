import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ClassificationPostList,
  PostListInClassificationFolder,
} from '../dto/classification.dto';
import { PaginationMetadata } from '@src/common';

export class AIPostListResponse {
  @ApiProperty({
    type: PaginationMetadata,
  })
  metadata: PaginationMetadata;

  @ApiProperty()
  list: PostListInClassificationFolder[] | ClassificationPostList[];

  constructor(
    metaData: PaginationMetadata,
    classificationPostList:
      | PostListInClassificationFolder[]
      | ClassificationPostList[],
  ) {
    this.metadata = metaData;
    this.list = classificationPostList;
  }
}
