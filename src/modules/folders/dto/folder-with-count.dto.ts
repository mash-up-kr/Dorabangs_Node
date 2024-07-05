import { FolderDomain } from '@src/domains/folder';
import { FolderDocument } from '@src/infrastructure';

export interface FolderListServiceDto {
  /**  */
  defaultFolders: any[];
  customFolders: any[];
}
