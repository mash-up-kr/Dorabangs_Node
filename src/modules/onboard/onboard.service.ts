import { Injectable } from '@nestjs/common';
import { onBoardCategoryList } from './onboard.const';
import { OnBoardQuery } from './dto';
import * as _ from 'lodash';

@Injectable()
export class OnboardService {
  listOnBoardKeywords(query: OnBoardQuery) {
    return query.limit
      ? this.getLimitedOnBoardKeywords(onBoardCategoryList, query.limit)
      : onBoardCategoryList;
  }

  private getLimitedOnBoardKeywords(keywords: string[], limit: number) {
    return _.shuffle(keywords).splice(0, limit);
  }
}
