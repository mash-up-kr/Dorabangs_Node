import { Module } from '@nestjs/common';
import { OnboardController } from './onboard.controller';
import { OnboardService } from './onboard.service';

@Module({
  providers: [OnboardService],
  controllers: [OnboardController],
})
export class OnboardModule {}
