import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MutateFolderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '폴더 이름',
  })
  readonly name: string;
}
