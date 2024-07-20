import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { OpenAIError, RateLimitError } from 'openai';
import { DiscordAIWebhookProvider } from '../discord/discord-ai-webhook.provider';
import { gptVersion } from './ai.constant';
import { SummarizeURLContentDto } from './dto';
import { summarizeURLContentFunctionFactory } from './functions';
import { SummarizeURLContent } from './types/types';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private readonly config: ConfigService,
    private readonly discordAIWebhookProvider: DiscordAIWebhookProvider,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async summarizeLinkContent(
    content: string,
    userFolderList: string[],
    url: string,
    temperature = 0.5,
  ): Promise<SummarizeURLContentDto> {
    try {
      // 사용자 폴더 + 서버에서 임의로 붙여주는 폴더 리스트
      const folderLists = [...userFolderList];
      // AI Summary 호출
      const promptResult = await this.invokeAISummary(
        content,
        folderLists,
        url,
        temperature,
      );

      // Function Call 결과
      const summaryResult: SummarizeURLContent = JSON.parse(
        promptResult.choices[0].message.tool_calls[0].function.arguments,
      );
      // 분류된 카테고리가 사용자 카테고리 범위에 속해있는지에 대해 검사
      const checkIsUserCategory = userFolderList.includes(
        summaryResult.category,
      );
      return new SummarizeURLContentDto({
        success: true,
        isUserCategory: checkIsUserCategory,
        response: summaryResult,
      });
    } catch (err) {
      return new SummarizeURLContentDto({
        success: false,
        message:
          err instanceof RateLimitError
            ? '크레딧을 모두 소진하였습니다.'
            : err instanceof OpenAIError
              ? err.message
              : '요약에 실패하였습니다.',
      });
    }
  }

  private async invokeAISummary(
    content: string,
    folderList: string[],
    url: string,
    temperature: number,
  ) {
    let elapsedTime: number = 0;
    const startTime = new Date();
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
            function: summarizeURLContentFunctionFactory(folderList),
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

    elapsedTime = new Date().getTime() - startTime.getTime();
    this.discordAIWebhookProvider.send(
      [
        `AI 요약 실행 시간: ${elapsedTime}ms`,
        `Input`,
        `- URL : ${url}`,
        `- 인풋 폴더 : [${folderList.join(', ')}]`,
        `Output : ${promptResult} `,
      ].join('\n'),
    );

    return promptResult;
  }
}
