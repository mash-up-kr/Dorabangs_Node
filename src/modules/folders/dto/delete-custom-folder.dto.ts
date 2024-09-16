import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCustomFolderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '삭제할 유저 id',
  })
  userId: string;
}
