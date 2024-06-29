import { SummarizeURLContent } from '@src/infrastructure/ai/types/types';

export class SummarizeURLContentResponse {
  success: boolean;
  isUserCategory?: boolean;
  response?: SummarizeURLContent;
  message?: string;

  constructor(data: SummarizeURLContentResponse) {
    Object.assign(this, data);
  }
}
