import { Injectable } from '@nestjs/common';
import { onBoardCategoryList } from './onboard.const';

@Injectable()
export class OnboardService {
  getOnboardCategories() {
    return onBoardCategoryList;
  }
}
