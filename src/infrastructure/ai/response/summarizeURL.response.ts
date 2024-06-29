import { SummarizeURLContent } from '@src/infrastructure/ai/types/types';

export class SummarizeURLContentResponse {
  success: boolean;
  inputToken?: number;
  outputToken?: number;
  response?: SummarizeURLContent;
  message?: string;

  constructor(data: SummarizeURLContentResponse) {
    Object.assign(this, data);
  }
}
