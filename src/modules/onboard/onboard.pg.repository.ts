import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OnboardCategory } from '@src/infrastructure/database/entities/onboard-category.entity';
import { onBoardCategoryList } from './onboard.const';

@Injectable()
export class OnBoardRepository extends Repository<OnboardCategory> {
  constructor(private dataSource: DataSource) {
    super(OnboardCategory, dataSource.createEntityManager());
  }

  private addOnboardList() {
    const newList = onBoardCategoryList.map((category) => category);
    return newList.map((category: string) => {
      const newCategory = this.create({ category });
      this.save(newCategory);
      return newCategory;
    });
  }

  async getOnboardCategoryList() {
    const categories = await this.find();
    if (!categories) {
      return this.addOnboardList();
    }
    return categories;
  }
}
