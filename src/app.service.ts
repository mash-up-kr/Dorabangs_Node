import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getHello(): string {
    return 'Hello Dorabangs!';
  }
  async poolMetrics() {
    try {
      const puppeteerURL = this.config.get<string>('PUPPETEER_POOL_URL');
      const response = await fetch(`http://${puppeteerURL}/health/metrics`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return 'Fail to retrieve pool metrics';
    }
  }
}
