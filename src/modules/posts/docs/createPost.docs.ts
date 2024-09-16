import { Types } from 'mongoose';

import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const CreatePostDocs = applyDecorators(
  ApiOperation({
    summary: '피드 링크 저장',
  }),
  ApiResponse({
    type: Types.ObjectId,
  }),
  ApiNotFoundResponse({
    description: ['F002'].join(', '),
  }),
);
