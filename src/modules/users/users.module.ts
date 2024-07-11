import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './guards/strategy';
import { User, UserSchema } from '@src/infrastructure';
import { UsersRepository } from './users.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersPGRepository } from './users.pg.repository';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersPGRepository, JwtStrategy],
})
export class UsersModule {}
