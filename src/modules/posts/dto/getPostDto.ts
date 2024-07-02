import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@src/infrastructure';

export class GetPostDto {
  @ApiProperty({ type: String, description: '유저 ID' })
  userId: string;
  @ApiProperty({ type: String, description: '폴더 ID' })
  folderId: string;
  @ApiProperty({ type: String, description: '저장한 URL' })
  url: string;
  @ApiProperty({ type: String, description: 'URL 제목' })
  title: string;
  @ApiProperty({ type: String, nullable: true, description: 'AI 요약' })
  description?: string | null;
  @ApiProperty({ type: Boolean, description: '즐겨찾기 여부' })
  isFavorite: boolean;
  @ApiProperty({ type: Date, description: '생성 일시' })
  createdAt: string;
  @ApiProperty({ type: Date, description: '업데이트 일시' })
  updatedAt: string;

  constructor(post: Post) {
    this.folderId = post.folderId.toString();
    this.userId = post.userId.toString();
    this.url = post.url;
    this.title = post.title;
    this.description = post.title;
    this.isFavorite = post.isFavorite;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
