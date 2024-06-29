import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAIFolderNameListItem {
  @ApiProperty({ description: '폴더 id' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: '폴더 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  constructor(data: GetAIFolderNameListItem) {
    Object.assign(this, data);
  }
}

export class GetAIFolderNameListResponse {
  @ApiProperty({
    type: GetAIFolderNameListItem,
    isArray: true,
  })
  list: GetAIFolderNameListItem[];

  constructor(data: GetAIFolderNameListResponse) {
    Object.assign(this, data);
  }
}
