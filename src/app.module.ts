// Nest Packages
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Custom Packages
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ClassificationModule } from './modules/classification/classification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get<string>('MONGO_URL'),
        };
      },
    }),
    UsersModule,
    ClassificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
