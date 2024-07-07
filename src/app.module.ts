// Nest Packages
import { Module } from '@nestjs/common';

// Custom Packages
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/infrastructure';
import { AiModule } from './infrastructure/ai/ai.module';
import { UsersModule } from './modules/users/users.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { AuthModule } from './modules/auth/auth.module';
import { FoldersModule } from './modules/folders/folders.module';
import { PostsModule } from './modules/posts/posts.module';
import { LinksModule } from './modules/links/links.module';
import { AwsLambdaModule } from './infrastructure/aws-lambda/aws-lambda.module';
import { OnboardModule } from './modules/onboard/onboard.module';

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
    ClassificationModule,
    AuthModule,
    PostsModule,
    FoldersModule,
    LinksModule,
    AwsLambdaModule,
    OnboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
