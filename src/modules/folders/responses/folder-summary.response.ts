import { ApiProperty } from '@nestjs/swagger';
import { FolderType } from '@src/types/folder-type.enum';
import { IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class FolderSummaryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: FolderType })
  type: FolderType;

  @ApiProperty()
  createdAt: Date;

  constructor(
    data: Omit<FolderSummaryResponse, 'id'> & { _id: Types.ObjectId },
  ) {
    Object.assign(this, data);

    this.id = data._id.toString();
  }
}
