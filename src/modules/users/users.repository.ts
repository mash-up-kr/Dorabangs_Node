import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@src/infrastructure';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOrCreateUser(deviceToken: string): Promise<string> {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          deviceToken: deviceToken,
        },
        {
          $set: {
            deviceToken: deviceToken,
          },
        },
        {
          new: true,
          upsert: true,
        },
      )
      .lean();
    const userId = user._id.toString();
    return userId;
  }
}
