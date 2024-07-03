import { ApiProperty } from '@nestjs/swagger';
import { PostUpdateableFields } from '../type/type';
import { IsBoolean, IsOptional } from 'class-validator';

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
}
