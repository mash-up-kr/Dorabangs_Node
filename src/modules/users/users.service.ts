import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/type';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    // 새로운 user의 ID
    const userId = await this.userRepository.findOrCreateUser(dto.deviceToken);
    // JWT Token Payload
    const tokenPayload: JwtPayload = {
      id: userId,
    };
    // JWT Token 발급
    const token = await this.issueAccessToken(tokenPayload);
    return token;
  }

  private async issueAccessToken(payload: JwtPayload) {
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRE_TIME'),
    });
    return token;
  }
}
