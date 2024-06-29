import { ApiProperty } from '@nestjs/swagger';
import { FolderResponse } from './folder.response';
import { PostResponse } from './post.response';

export class PostListInFolderResponse extends FolderResponse {
  @ApiProperty({ type: PostResponse, isArray: true })
  posts: PostResponse[];

  constructor(data: PostListInFolderResponse) {
    super(data);
    Object.assign(this, data);
  }
}
