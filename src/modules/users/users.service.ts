import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema';
import { CreateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/type';
import { ConfigService } from '@nestjs/config';
import { CreateUserResponse } from './response';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          deviceToken: dto.deviceToken,
        },
        {
          $set: {
            deviceToken: dto.deviceToken,
          },
        },
        {
          new: true,
          upsert: true,
        },
      )
      .lean();
    const tokenPayload: JwtPayload = {
      id: user._id.toString(),
    };
    const token = await this.issueAccessToken(tokenPayload);
    return new CreateUserResponse({
      accessToken: token,
    });
  }

  private async issueAccessToken(payload: JwtPayload) {
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRE_TIME'),
    });
    return token;
  }
}
