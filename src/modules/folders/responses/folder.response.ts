import { ApiProperty } from '@nestjs/swagger';
import { FolderType } from '@src/types/folder-type.enum';
import { IsEnum } from 'class-validator';
import { FolderSummaryResponse } from './folder-summary.response';

export class FolderResponse extends FolderSummaryResponse {
  @ApiProperty()
  postCount: number;

  constructor(data: FolderResponse) {
    super(data);
    Object.assign(this, data);
  }
}
