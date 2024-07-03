import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const DeletePostDocs = applyDecorators(
  ApiOperation({
    summary: 'URL 삭제',
  }),
);
