import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadata } from '@src/common';
import { Post } from '@src/infrastructure';
import { Types } from 'mongoose';

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

  constructor(data: Post & { _id: Types.ObjectId }) {
    this.id = data._id.toString();
    this.folderId = data.folderId.toString();
    this.url = data.url;
    this.title = data.title;
    this.description = data.description;
    this.isFavorite = data.isFavorite;
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
  items: ListPostItem[];

  constructor(metadata: PaginationMetadata, items: ListPostItem[]) {
    this.metadata = metadata;
    this.items = items;
  }
}
