import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OnboardCategory } from '@src/infrastructure/database/entities/onboard-category.entity';
import { onBoardCategoryList } from './onboard.const';

@Injectable()
export class OnBoardRepository extends Repository<OnboardCategory> {
  constructor(private dataSource: DataSource) {
    super(OnboardCategory, dataSource.createEntityManager());
  }

  private async addOnboardList() {
    const newList = onBoardCategoryList.map((category) => ({ category }));

    await this.createQueryBuilder()
      .insert()
      .into('onboards')
      .values(newList)
      .execute();

    return this.find();
  }

  async getOnboardCategoryList() {
    const categories = await this.find();

    if (categories.length === 0) {
      return this.addOnboardList();
    }
    return categories;
  }
}
