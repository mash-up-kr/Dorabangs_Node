import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@src/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class ListPostQueryDto extends PaginationQuery {
  @ApiProperty({
    required: false,
    description: '즐겨찾기 필터링 여부 확인',
  })
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  favorite: boolean;

  @ApiProperty({
    required: false,
    description: '읽음 필터링 여부',
  })
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  isRead: boolean;
}
