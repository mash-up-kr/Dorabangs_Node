import { ApiProperty } from '@nestjs/swagger';
import { AIFolderNameServiceDto } from '../dto/getAIFolderNameLIst.dto';
import { ClassificationFolderWithCount } from '../dto/classification.dto';

export class AIFolderNameListResponse {
  @ApiProperty({
    isArray: true,
  })
  list: ClassificationFolderWithCount[];

  constructor(data: ClassificationFolderWithCount[]) {
    this.list = data;
  }
}
