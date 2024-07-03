import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Schema } from 'mongoose';
import { AIClassification } from '@src/infrastructure';

@Injectable()
export class ClassficiationRepository {
  constructor(
    @InjectModel(AIClassification.name)
    private readonly aiClassificationModel: Model<AIClassification>,
  ) {}
  async findBySuggestedFolderId(
    folderIds: Types.ObjectId[],
  ): Promise<Schema.Types.ObjectId[]> {
    return await this.aiClassificationModel
      .distinct('suggestedFolderId')
      .where('suggestedFolderId')
      .in(folderIds)
      .exec();
  }
  async delete(id: string) {
    await this.aiClassificationModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();
  }

  async deleteBySuggestedFolderId(suggestedFolderId: string) {
    await this.aiClassificationModel
      .updateMany(
        { suggestedFolderId: suggestedFolderId, deletedAt: null },
        { $set: { deletedAt: new Date() } },
      )
      .exec();
  }
}
