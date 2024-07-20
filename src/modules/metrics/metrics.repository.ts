import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Metrics } from '@src/infrastructure/database/schema/metrics.schema';
import { Model } from 'mongoose';

@Injectable()
export class MetricsRepository {
  constructor(
    @InjectModel(Metrics.name) private readonly metricsModel: Model<Metrics>,
  ) {}

  async createMetrics(
    isSuccess: boolean,
    time: number,
    postURL: string,
    postId: string,
    inputToken: number,
    outputToken: number,
  ) {
    const metrics = await this.metricsModel.create({
      isSuccess,
      time,
      postURL,
      postId,
      inputToken,
      outputToken,
    });
    return metrics;
  }
}
