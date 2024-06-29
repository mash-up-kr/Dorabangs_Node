import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAIFolderNameListResponse } from '../dto/getAIFolderNameLIst.dto';

export const GetAIFolderNameListDocs = applyDecorators(
  ApiOperation({
    summary: '폴더 리스트',
    description: 'AI 분류 폴더 리스트.',
  }),
  ApiResponse({
    type: Promise<{ id: string; name: string }[]>,
  }),
  ApiResponse({
    type: GetAIFolderNameListResponse,
  }),
  ApiBearerAuth(),
);
