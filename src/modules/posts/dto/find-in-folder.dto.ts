import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@src/common';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostQueryDto extends PaginationQuery {
  @ApiProperty({
    required: false,
    description: '읽음 필터링 여부',
  })
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  isRead: boolean;
}
