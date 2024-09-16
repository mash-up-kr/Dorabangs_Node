import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostFolderDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  folderId: string;
}
