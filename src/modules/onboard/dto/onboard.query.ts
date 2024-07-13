import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class OnBoardQuery {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;
}
