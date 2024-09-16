import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AIPostListResponse } from '../response/ai-post-list.dto';

export const PatchAIPostDocs = applyDecorators(
  ApiOperation({
    summary: 'Post 하나 이동',
    description: '추천해준 폴더로 post이동',
  }),
  ApiResponse({
    type: AIPostListResponse,
  }),
  ApiBearerAuth(),
);
