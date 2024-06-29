import { ApiProperty } from '@nestjs/swagger';
import { FolderType } from '@src/types/folder-type.enum';
import { IsEnum } from 'class-validator';

export class FolderSummaryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: FolderType })
  type: FolderType;

  @ApiProperty()
  createdAt: string;

  constructor(data: FolderSummaryResponse) {
    Object.assign(this, data);
  }
}
