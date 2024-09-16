import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetadata } from '@src/common';

import { ClassificationPostList } from '../dto/classification.dto';

export class AIPostListResponse {
  @ApiProperty({
    type: PaginationMetadata,
  })
  metadata: PaginationMetadata;

  @ApiProperty({
    type: ClassificationPostList,
    isArray: true,
  })
  list: ClassificationPostList[];

  constructor(
    metaData: PaginationMetadata,
    classificationPostList: ClassificationPostList[],
  ) {
    this.metadata = metaData;
    this.list = classificationPostList;
  }
}
