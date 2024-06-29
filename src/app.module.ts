// Nest Packages
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Custom Packages
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { FoldersModule } from './modules/folders/folders.module';
import { LinksModule } from './modules/links/links.module';

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
    FoldersModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
