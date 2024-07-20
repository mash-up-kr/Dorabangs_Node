import { ApiProperty } from '@nestjs/swagger';
import { FolderResponse } from './folder.response';
import { PostDocument } from '@src/infrastructure';

/**
 * @todo
 * 추후 이동 예정
 */
class Keyword {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

/**
 * @todo
 * 추후 post module로 이동 예정
 */
export class PostResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  folderId: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string;

  @ApiProperty()
  isFavorite: boolean;

  @ApiProperty()
  readAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: Keyword, isArray: true })
  keywords: Keyword[];

  constructor(data: PostDocument) {
    this.id = data._id.toString();
    this.userId = data.userId.toString();
    this.folderId = data.folderId.toString();
    this.url = data.url;
    this.title = data.title;
    this.description = data.description;
    this.isFavorite = data.isFavorite;
    this.readAt = data.readAt;
    this.createdAt = data.createdAt;
  }
}
