import { ApiProperty } from '@nestjs/swagger';
import { FolderResponse } from './folder.response';
import { PostResponse } from './post.response';

export class PostListInFolderResponse {
  @ApiProperty()
  count: number;

  @ApiProperty({ type: PostResponse, isArray: true })
  list: PostResponse[];

  constructor(data: PostListInFolderResponse) {
    Object.assign(this, data);
  }
}
