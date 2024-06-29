import { ApiProperty } from '@nestjs/swagger';
import { FolderSummaryResponse } from './folder-summary.response';
import { Types } from 'mongoose';
import { FolderDocument } from '@src/infrastructure';

export class FolderResponse extends FolderSummaryResponse {
  @ApiProperty()
  postCount: number;

  constructor(data: FolderDocument) {
    super(data);
    Object.assign(this, data);
  }
}
