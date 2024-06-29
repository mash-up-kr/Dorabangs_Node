import { Injectable } from '@nestjs/common';

@Injectable()
export class LinksService {
  async validateLink(link: string): Promise<boolean> {
    const res = await fetch(link);

    if (res.status !== 200) {
      return false;
    }

    return true;
  }
}
