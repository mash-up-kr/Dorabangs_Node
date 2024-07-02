import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AIPostServiceDto } from '../dto/getAIPostList.dto';

export class AIPostListResponse {
  @ApiProperty({ type: [AIPostServiceDto] })
  @Type(() => AIPostServiceDto)
  list: AIPostServiceDto[];

  constructor(data: AIPostServiceDto[]) {
    this.list = data;
  }
}
