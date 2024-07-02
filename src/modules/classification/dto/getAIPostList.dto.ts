import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Post, AIClassification, PostDocument } from '@src/infrastructure';
import { Document } from 'mongoose';
import { MergeType } from 'mongoose';
import { Types } from 'mongoose';

export class AIPostServiceDto {
  @ApiProperty({ description: 'Id' })
  id: string;

  @ApiProperty({ description: 'Title' })
  title: string;

  @ApiProperty({ description: 'URL' })
  url: string;

  @ApiProperty({ description: 'Description' })
  description: string;

  @ApiProperty({ description: 'Keywords' })
  keywords: string[];

  @ApiProperty({ description: 'Created At' })
  createdAt: Date;

  constructor(post: PostDocument, aiClassificationId: AIClassification) {
    this.id = post.id;
    this.title = post.title;
    this.url = post.url;
    this.description = post.description;
    this.keywords = aiClassificationId.keywords;
    this.createdAt = aiClassificationId.createdAt;
  }
}

export class AIPostListResponse {
  @ApiProperty({ type: [AIPostServiceDto] })
  @Type(() => AIPostServiceDto)
  list: AIPostServiceDto[];

  constructor(data: AIPostServiceDto[]) {
    this.list = data;
  }
}
