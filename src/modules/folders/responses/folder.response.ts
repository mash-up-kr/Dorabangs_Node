import { ApiProperty } from '@nestjs/swagger';
import { FolderSummaryResponse } from './folder-summary.response';
import { Types } from 'mongoose';

export class FolderResponse extends FolderSummaryResponse {
  @ApiProperty()
  postCount: number;

  constructor(data: Omit<FolderResponse, 'id'> & { _id: Types.ObjectId }) {
    super(data);
    Object.assign(this, data);
  }
}
