import { Injectable } from '@nestjs/common';
import { AiService } from '@src/infrastructure/ai/ai.service';
import { AiClassificationPayload } from '@src/infrastructure/aws-lambda/type';
import { ClassficiationRepository } from '../classification/classification.repository';
import { FolderRepository } from '../folders/folders.repository';
import { KeywordsRepository } from '../keywords/keyword.repository';
import { PostKeywordsRepository } from '../posts/postKeywords.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class AiClassificationService {
  constructor(
    private readonly aiService: AiService,
    private readonly classificationRepository: ClassficiationRepository,
    private readonly folderRepository: FolderRepository,
    private readonly postRepository: PostsRepository,
    private readonly keywordsRepository: KeywordsRepository,
    private readonly postKeywordsRepository: PostKeywordsRepository,
  ) {}

  async execute(payload: AiClassificationPayload) {
    try {
      // Map - (Folder Name):(Folder ID)

      const folderMapper = {};
      const folderNames = payload.folderList.map((folder) => {
        folderMapper[folder.name] = folder.id;
        return folder.name;
      });

      // NOTE: AI 요약 요청
      const summarizeUrlContent = await this.aiService.summarizeLinkContent(
        payload.postContent,
        folderNames,
        payload.url,
      );

      // NOTE : 요약 성공 시 classification 생성, post 업데이트
      if (summarizeUrlContent.success) {
        const postId = payload.postId;
        let folderId = folderMapper[summarizeUrlContent.response.category];

        if (!folderId) {
          folderId = await this.folderRepository.getDefaultFolder(
            payload.userId,
          );
        }

        const post =
          await this.postRepository.findPostByIdForAIClassification(postId);
        const classification =
          await this.classificationRepository.createClassification(
            post.url,
            summarizeUrlContent.response.summary,
            summarizeUrlContent.response.keywords,
            folderId,
          );
        await this.postRepository.updatePostClassificationForAIClassification(
          postId,
          classification._id.toString(),
          summarizeUrlContent.response.summary,
        );

        const keywords = await this.keywordsRepository.createMany(
          summarizeUrlContent.response.keywords,
        );

        const keywordIds = keywords.map((keyword) => keyword._id.toString());
        await this.postKeywordsRepository.createPostKeywords(
          postId,
          keywordIds,
        );
      }

      return summarizeUrlContent;
    } catch (error: unknown) {
      return { success: fail, error };
    }
  }
}
