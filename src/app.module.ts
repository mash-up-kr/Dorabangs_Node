// Nest Packages
import { Module } from '@nestjs/common';

// Custom Packages
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/infrastructure';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './infrastructure/ai/ai.module';
import { AwsLambdaModule } from './infrastructure/aws-lambda/aws-lambda.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { FoldersModule } from './modules/folders/folders.module';
import { LinksModule } from './modules/links/links.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { OnboardModule } from './modules/onboard/onboard.module';
import { PostsModule } from './modules/posts/posts.module';
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
    ClassificationModule,
    AuthModule,
    FoldersModule,
    LinksModule,
    PostsModule,
    AwsLambdaModule,
    OnboardModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
