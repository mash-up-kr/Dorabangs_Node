import { Module } from '@nestjs/common';
import { OnboardService } from './onboard.service';
import { OnboardController } from './onboard.controller';

@Module({
  providers: [OnboardService],
  controllers: [OnboardController]
})
export class OnboardModule {}
