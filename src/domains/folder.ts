import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';

export class FolderDomain {
  userId: string;

  name: string;

  type: FolderType;
}
