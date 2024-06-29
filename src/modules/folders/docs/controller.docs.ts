import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const FolderControllerDocs = applyDecorators(ApiTags('Folder API'));
