import { Module } from '@nestjs/common';
import { OnboardController } from './onboard.controller';
import { OnboardService } from './onboard.service';

@Module({
  controllers: [OnboardController],
  providers: [OnboardService],
})
export class OnboardModule {}
