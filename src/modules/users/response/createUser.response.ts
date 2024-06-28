import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty()
  accessToken: string;

  constructor(data: CreateUserResponse) {
    Object.assign(this, data);
  }
}
