import { ApiProperty } from '@nestjs/swagger';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';
import { Types } from 'mongoose';

export class FolderSummaryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: FolderType })
  type: FolderType;

  @ApiProperty()
  createdAt: string;

  constructor(
    data: Omit<FolderSummaryResponse, 'id'> & { _id: Types.ObjectId },
  ) {
    this.id = data._id.toString();
    this.name = data.name;
    this.type = data.type;
    this.createdAt = data.createdAt;
  }
}
