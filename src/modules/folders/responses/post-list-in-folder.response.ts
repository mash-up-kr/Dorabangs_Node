import { ApiProperty } from '@nestjs/swagger';
import { FolderResponse } from './folder.response';
import { PostResponse } from './post.response';
import { PostDocument } from '@src/infrastructure';

export class PostListInFolderResponse {
  @ApiProperty()
  count: number;

  @ApiProperty({ type: PostResponse, isArray: true })
  list: PostResponse[];

  constructor(count: number, list: PostDocument[]) {
    this.count = count;
    this.list = list.map((post) => new PostResponse(post));
  }
}
