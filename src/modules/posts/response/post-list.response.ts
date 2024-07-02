import { ApiProperty } from '@nestjs/swagger';
import { GetPostDto } from '@src/modules/posts/dto/getPostDto';

export class PostListResponse {
  @ApiProperty({ type: Number, description: '피드 총 개수' })
  postCount: number;
  @ApiProperty({ isArray: true, type: GetPostDto, description: '피드 리스트' })
  postList: GetPostDto[];

  constructor(postDtoList: GetPostDto[], postCount: number) {
    this.postCount = postCount;
    this.postList = postDtoList;
  }
}
