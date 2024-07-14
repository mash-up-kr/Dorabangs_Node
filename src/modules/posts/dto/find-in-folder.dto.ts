import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@src/common';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostQueryDto extends PaginationQuery {
  @ApiProperty({
    description: '읽지 않음 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  unread?: boolean;
}
