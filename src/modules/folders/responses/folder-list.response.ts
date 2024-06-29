import { ApiProperty } from '@nestjs/swagger';
import { FolderType } from '@src/types/folder-type.enum';
import { FolderResponse } from './folder.response';

export class FolderListResponse {
  @ApiProperty({ isArray: true, type: FolderResponse })
  defaultFolders: FolderResponse[];

  @ApiProperty({ isArray: true, type: FolderResponse })
  customFolders: FolderResponse[];

  constructor(data: FolderListResponse) {
    Object.assign(this, data);
  }
}
