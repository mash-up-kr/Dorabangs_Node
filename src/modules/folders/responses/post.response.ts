import { ApiProperty } from '@nestjs/swagger';
import { PostDocument } from '@src/infrastructure';
import { PostAiStatus } from '@src/modules/posts/posts.constant';

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
  @ApiProperty({ required: true, description: '피드 id', type: String })
  id: string;

  @ApiProperty({ required: true, description: '유저 id', type: String })
  userId: string;

  @ApiProperty({ required: true, description: '폴더 id', type: String })
  folderId: string;

  @ApiProperty({ required: true, description: '피드 URL', type: String })
  url: string;

  @ApiProperty({ required: true, description: '피드 제목', type: String })
  title: string;

  @ApiProperty({
    nullable: true,
    description: '요약 정보',
    type: String,
  })
  description: string;

  @ApiProperty({ description: '즐겨찾기 여부' })
  isFavorite: boolean;

  @ApiProperty({ nullable: true, description: '읽은 시간' })
  readAt: Date;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ type: Keyword, isArray: true })
  keywords: Keyword[];

  @ApiProperty({ nullable: true, description: 'URL og 이미지' })
  thumbnailImgUrl: string | null;

  @ApiProperty({
    required: true,
    enum: PostAiStatus,
    description: '피드 게시글의 ai 진행 상태',
  })
  aiStatus: PostAiStatus;

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
    this.thumbnailImgUrl = data.thumbnailImgUrl;
    this.aiStatus = data.aiStatus;
  }
}
