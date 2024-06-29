import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { CreateUserDocs, UserControllerDocs } from './docs';
import { CreateUserResponse } from './response';

@Controller('users')
@UserControllerDocs
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @CreateUserDocs
  async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResponse> {
    const token = await this.userService.createUser(dto);
    const response = new CreateUserResponse({
      accessToken: token,
    });
    return response;
  }
}
