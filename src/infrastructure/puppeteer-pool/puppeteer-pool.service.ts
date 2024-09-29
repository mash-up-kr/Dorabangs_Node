import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PuppeteerPoolService {
  private puppeteerURL: string = '';

  constructor(private config: ConfigService) {
    this.puppeteerURL = `http://${config.get<string>('PUPPETEER_POOL_URL')}`;
  }

  async getPoolMetrics() {
    try {
      const response = await fetch(`${this.puppeteerURL}/health/metrics`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return 'Fail to retrieve pool metrics';
    }
  }

  async invokeRemoteSessionParser(url: string) {
    try {
      const response = await fetch(this.puppeteerURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
        }), // JSON 데이터를 문자열로 변환
      });
      if (!response.ok) {
        return {
          ok: false,
          body: {},
        };
      }
      const responseJSON = await response.json();
      return {
        ok: true,
        body: responseJSON,
      };
    } catch (err) {
      return {
        ok: false,
        body: {},
      };
    }
  }
}
