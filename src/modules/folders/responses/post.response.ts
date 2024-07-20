import { ApiProperty } from '@nestjs/swagger';
import { Keyword, Post } from '@src/infrastructure';
import { KeywordItem } from '@src/modules/posts/response/keyword-list.response';
import { Types } from 'mongoose';

/**
 * @todo
 * 추후 이동 예정
 */

/**
 * @todo
 * 추후 post module로 이동 예정
 */
export class PostResponse {
  @ApiProperty()
  id: string;

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
  createdAt: Date;

  @ApiProperty({ type: Keyword, isArray: true })
  keywords: KeywordItem[];

  constructor(
    data: Post & {
      _id: Types.ObjectId;
      keywords: (Keyword & { _id: Types.ObjectId })[];
    },
  ) {
    this.id = data._id.toString();
    this.folderId = data.folderId.toString();
    this.url = data.url;
    this.title = data.title;
    this.description = data.description;
    this.keywords = data.keywords.map((keyword) => new KeywordItem(keyword));
    this.isFavorite = data.isFavorite;
    this.createdAt = data.createdAt;
  }
}
