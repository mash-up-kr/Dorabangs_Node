import { ApiProperty } from '@nestjs/swagger';
import { FolderResponse } from './folder.response';

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
  userId: string;

  @ApiProperty()
  folderId: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  isFavorite: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: Keyword, isArray: true })
  keywords: Keyword[];

  constructor(data: PostResponse) {
    Object.assign(this, data);
  }
}
