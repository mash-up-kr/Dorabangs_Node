import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './guards/strategy';
import { Folder, FolderSchema, User, UserSchema } from '@src/infrastructure';
import { UsersRepository } from './users.repository';
import { AuthModule } from '../auth/auth.module';
import { FolderRepository } from '../folders/folders.repository';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, FolderRepository, JwtStrategy],
})
export class UsersModule {}
