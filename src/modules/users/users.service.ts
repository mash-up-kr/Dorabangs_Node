import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { JwtPayload } from 'src/common/types/type';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    // 새로운 user의 ID
    const userId = await this.userRepository.findOrCreateUser(dto.deviceToken);
    // JWT Token Payload
    const tokenPayload: JwtPayload = {
      id: userId,
    };
    // JWT Token 발급
    const token = await this.authService.issueAccessToken(tokenPayload);
    return token;
  }
}
