import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export const ListPostDocs = applyDecorators(
  ApiOperation({
    summary: '전체 피드 조회',
  }),
  ApiBearerAuth(),
);
