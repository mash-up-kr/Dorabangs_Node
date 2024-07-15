import { ApiProperty } from '@nestjs/swagger';
import { PostUpdateableFields } from '../type/type';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdatePostDto implements PostUpdateableFields {
  // Temporary ignore in MVP level
  title: string;
  @ApiProperty({
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;

  @ApiProperty({
    required: false,
    default: false,
  })
  @IsOptional()
  @IsDateString()
  readAt: Date;
}
