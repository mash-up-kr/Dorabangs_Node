// Nest Packages
import { Module } from '@nestjs/common';

// Custom Packages
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/infrastructure';
import { AiModule } from './infrastructure/ai/ai.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    DatabaseModule,
    AiModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
