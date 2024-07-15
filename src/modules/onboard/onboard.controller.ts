import { Controller, Get, Query } from '@nestjs/common';
import { OnboardService } from './onboard.service';
import { OnBoardQuery } from './dto';
import { ListOnBoardKeywordsDocs, OnBoardControllerDocs } from './docs';

@Controller('onboard')
@OnBoardControllerDocs
export class OnboardController {
  constructor(private readonly onboardService: OnboardService) {}

  @Get()
  @ListOnBoardKeywordsDocs
  listOnBoardKeywords(@Query() query: OnBoardQuery) {
    return this.onboardService.listOnBoardKeywords(query);
  }
}
