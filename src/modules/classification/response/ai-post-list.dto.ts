import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ClassificationPostList,
  PostListInClassificationFolder,
} from '../dto/classification.dto';

export class AIPostListResponse {
  @ApiProperty()
  list: PostListInClassificationFolder[] | ClassificationPostList[];

  constructor(
    data: PostListInClassificationFolder[] | ClassificationPostList[],
  ) {
    this.list = data;
  }
}
