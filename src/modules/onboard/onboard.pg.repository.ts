import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OnboardCategory } from '@src/infrastructure/database/entities/onboard-category.entity';
import { onBoardCategoryList } from './onboard.const';

@Injectable()
export class OnBoardRepository extends Repository<OnboardCategory> {
  constructor(private dataSource: DataSource) {
    super(OnboardCategory, dataSource.createEntityManager());
  }

  addOnboardList() {
    const newCategory = this.create({ categoryList: onBoardCategoryList });
    this.save(newCategory);
    return newCategory.categoryList;
  }

  async getOnboardCategoryList() {
    const category = await this.findOne({});
    if (!category) {
      return this.addOnboardList();
    }
    return category.categoryList;
  }
}
