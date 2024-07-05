import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { JwtPayload } from 'src/common/types/type';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { FolderRepository } from '../folders/folders.repository';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly folderRepository: FolderRepository,
    private readonly authService: AuthService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    // 새로운 user의 ID
    const user = await this.userRepository.findOrCreate(dto.deviceToken);
    // JWT Token Payload
    const tokenPayload: JwtPayload = {
      id: user._id.toString(),
    };
    // JWT Token 발급
    const token = await this.authService.issueAccessToken(tokenPayload);

    await this.folderRepository.create(
      user._id.toString(),
      '나중에 읽을 링크',
      FolderType.DEFAULT,
    );

    return token;
  }
}
