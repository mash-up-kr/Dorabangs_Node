import { ApiProperty } from '@nestjs/swagger';
import { AIFolderNameServiceDto } from '../dto/getAIFolderNameLIst.dto';

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
