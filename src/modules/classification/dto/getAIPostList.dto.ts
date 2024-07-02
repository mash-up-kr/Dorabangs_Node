import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Post, AIClassification, PostDocument } from '@src/infrastructure';
import { Document } from 'mongoose';
import { MergeType } from 'mongoose';
import { Types } from 'mongoose';

export class AIPostServiceDto {
  id: string;

  title: string;

  url: string;

  description: string;

  keywords: string[];

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
