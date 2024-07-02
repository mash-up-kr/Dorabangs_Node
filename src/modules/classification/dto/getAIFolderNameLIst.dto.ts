import { ApiProperty } from '@nestjs/swagger';
import { FolderDocument } from '@src/infrastructure';
import { IsNotEmpty, IsString } from 'class-validator';

export class AIFolderNameServiceDto {
  id: string;

  name: string;

  constructor(data: FolderDocument) {
    this.id = data._id.toString();
    this.name = data.name;
  }
}

export class AIFolderNameListResponse {
  @ApiProperty({
    type: AIFolderNameServiceDto,
    isArray: true,
  })
  list: AIFolderNameServiceDto[];

  constructor(data: AIFolderNameServiceDto[]) {
    this.list = data;
  }
}
