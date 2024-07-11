import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostListResponse } from '@src/modules/posts/response/post-list.response';

export const GetPostListDocs = applyDecorators(
  ApiOperation({
    summary: 'URL 링크 리스트 조회',
  }),
  ApiResponse({
    type: PostListResponse,
  }),
  ApiBearerAuth(),
);
