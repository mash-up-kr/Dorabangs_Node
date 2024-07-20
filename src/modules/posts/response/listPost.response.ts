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

  @ApiProperty({ required: true, description: '생성 시간', type: Date })
  createdAt: Date;

  @ApiProperty({ required: false, description: '읽음 시간' })
  readAt: Date | null;

  @ApiProperty({ required: false, description: 'URL og 이미지' })
  thumbnailImgUrl: string;

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
    this.createdAt = data.createdAt;
    this.readAt = data.readAt;
    this.thumbnailImgUrl = data.thumbnailImgUrl;
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
