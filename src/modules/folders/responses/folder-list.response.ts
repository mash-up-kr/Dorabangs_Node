import { ApiProperty } from '@nestjs/swagger';
import { FolderResponse } from './folder.response';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';
import { FolderListServiceDto } from '../dto/folder-with-count.dto';

export class FolderListResponse {
  @ApiProperty({ isArray: true, type: FolderResponse })
  defaultFolders: FolderResponse[];

  @ApiProperty({ isArray: true, type: FolderResponse })
  customFolders: FolderResponse[];

  constructor(data: FolderListServiceDto) {
    this.defaultFolders = data.defaultFolders.map(
      (folder) => new FolderResponse(folder),
    );
    this.customFolders = data.customFolders.map(
      (folder) => new FolderResponse(folder),
    );
  }
}
