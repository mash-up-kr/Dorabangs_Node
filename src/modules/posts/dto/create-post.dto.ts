import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '폴더 id', required: true })
  folderId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '저장할 url', required: true })
  url: string;
}
