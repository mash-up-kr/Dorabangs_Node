import { ApiProperty } from '@nestjs/swagger';
import { FolderType } from '@src/types/folder-type.enum';
import { IsEnum } from 'class-validator';
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
