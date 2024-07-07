import { Controller, Get } from '@nestjs/common';
import { OnboardService } from './onboard.service';

@Controller('onboard')
export class OnboardController {
  constructor(private readonly onboardService: OnboardService) {}

  @Get()
  getOnboardCategories() {
    return this.onboardService.getOnboardCategories();
  }
}
