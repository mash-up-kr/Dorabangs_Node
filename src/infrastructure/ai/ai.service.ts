import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { RateLimitError, OpenAIError } from 'openai';
import { summarizeURLContentFunctionFactory } from './functions';
import { SummarizeURLContentResponse } from './response';
import { gptVersion, mockFolderLists } from './ai.constant';
import { SummarizeURLContent } from './types/types';

@Injectable()
export class AiService {
  private openai: OpenAI;

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
      // 사용자 폴더 + 서버에서 임의로 붙여주는 폴더 리스트
      const folderLists = [...userFolderList, ...mockFolderLists];
      const promptResult = await this.openai.chat.completions.create(
        {
          model: gptVersion,
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
              function: summarizeURLContentFunctionFactory(folderLists),
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

      // Function Call 결과
      const summaryResult: SummarizeURLContent = JSON.parse(
        promptResult.choices[0].message.tool_calls[0].function.arguments,
      );
      // 분류된 카테고리가 사용자 카테고리 범위에 속해있는지에 대해 검사
      const checkIsUserCategory = userFolderList.includes(
        summaryResult.category,
      );
      return new SummarizeURLContentResponse({
        success: true,
        isUserCategory: checkIsUserCategory,
        response: summaryResult,
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
