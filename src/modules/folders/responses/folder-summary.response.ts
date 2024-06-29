import { ApiProperty } from '@nestjs/swagger';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';

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
