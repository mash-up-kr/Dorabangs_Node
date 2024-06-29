import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { RateLimitError, OpenAIError } from 'openai';
import { summarizeURLContentFunctionFactory } from './functions';
import { SummarizeURLContentResponse } from './response';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private gptVersion = 'gpt-3.5-turbo-1106';
  // 서버에서 붙여주는 임의의 카테고리 리스트
  private mockFolderLists = [];

  constructor(private readonly config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: config.get<string>('OPENAI_API_KEY'),
    });
  }

  async summarizeURLContent(
    content: string,
    userFolderList: string[],
    temperature = 0.5,
  ) {
    try {
      const promptResult = await this.openai.chat.completions.create(
        {
          model: this.gptVersion,
          messages: [
            {
              role: 'system',
              content: '한글로 답변 부탁해',
            },
            {
              role: 'user',
              content: `주어진 글에 대해 요약하고 키워드 추출, 분류 부탁해
  
  ${content}
              `,
            },
          ],
          tools: [
            {
              type: 'function',
              function: summarizeURLContentFunctionFactory(userFolderList),
            },
          ],
          tool_choice: {
            type: 'function',
            function: { name: 'summarizeURL' },
          },
          temperature: temperature,
        },
        {
          maxRetries: 5,
        },
      );

      const tokenUsageData = promptResult.usage;
      const functionCall = JSON.parse(
        promptResult.choices[0].message.tool_calls[0].function.arguments,
      );
      return new SummarizeURLContentResponse({
        success: true,
        inputToken: tokenUsageData.prompt_tokens,
        outputToken: tokenUsageData.completion_tokens,
        response: functionCall,
      });
    } catch (err) {
      return new SummarizeURLContentResponse({
        success: false,
        message:
          err instanceof RateLimitError
            ? '크레딧을 모두 사용했습니다. 노티 부탁드려요!'
            : err instanceof OpenAIError
              ? err.message
              : '요약에 실패했습니다',
      });
    }
  }
}
