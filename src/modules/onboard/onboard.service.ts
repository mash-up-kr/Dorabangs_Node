import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { OnBoardQuery } from './dto';
import { onBoardCategoryList } from './onboard.const';

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
