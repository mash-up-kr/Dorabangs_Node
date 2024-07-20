import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadata } from '@src/common';
import { Post } from '@src/infrastructure';
import { Types } from 'mongoose';
import { PostAiStatus } from '@src/modules/posts/posts.constant';

export class ListPostItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  folderId: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isFavorite: boolean;

  @ApiProperty({
    required: false,
  })
  readAt: Date;

  @ApiProperty({ required: false, description: 'URL og 이미지' })
  thumbnail_img_url: string;

  @ApiProperty({
    required: true,
    enum: PostAiStatus,
    description: '피드 게시글의 ai 진행 상태',
  })
  aiStatus: PostAiStatus;

  constructor(data: Post & { _id: Types.ObjectId }) {
    this.id = data._id.toString();
    this.folderId = data.folderId.toString();
    this.url = data.url;
    this.title = data.title;
    this.description = data.description;
    this.isFavorite = data.isFavorite;
    this.readAt = data.readAt;
    this.thumbnail_img_url = data.thumbnailImgUrl;
    this.aiStatus = data.aiStatus;
  }
}

export class ListPostResponse {
  @ApiProperty({
    type: PaginationMetadata,
  })
  metadata: PaginationMetadata;

  @ApiProperty({
    type: ListPostItem,
    isArray: true,
  })
  list: ListPostItem[];

  constructor(metadata: PaginationMetadata, items: ListPostItem[]) {
    this.metadata = metadata;
    this.list = items;
  }
}
