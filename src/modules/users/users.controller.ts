import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { CreateUserDocs, UserControllerDocs } from './docs';

@Controller('users')
@UserControllerDocs
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  listUser() {
    return this.userService.listUser();
  }

  @Post()
  @CreateUserDocs
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
