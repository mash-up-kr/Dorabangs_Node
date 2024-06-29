import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_STRATEGY_TOKEN } from './strategy.token';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, ReqUserPayload } from 'src/common/types/type';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGY_TOKEN,
) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly config: ConfigService,
  ) {
    super({
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<ReqUserPayload> {
    const id = new Types.ObjectId(payload.id);
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('인증에 실패하였습니다.');
    }
    return {
      id,
    };
  }
}