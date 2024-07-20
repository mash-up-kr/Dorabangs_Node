import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseLinkTitleAndContent } from '@src/common';
import { IS_LOCAL } from '@src/common/constant';
import { Keyword, Post } from '@src/infrastructure';
import { AwsLambdaService } from '@src/infrastructure/aws-lambda/aws-lambda.service';
import { AiClassificationPayload } from '@src/infrastructure/aws-lambda/type';
import { FolderType } from '@src/infrastructure/database/types/folder-type.enum';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { FlattenMaps, Types } from 'mongoose';
import { AiClassificationService } from '../ai-classification/ai-classification.service';
import { FolderRepository } from '../folders/folders.repository';
import { ListPostQueryDto, UpdatePostDto, UpdatePostFolderDto } from './dto';
import { GetPostQueryDto } from './dto/find-in-folder.dto';
import { PostKeywordsRepository } from './postKeywords.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly folderRepository: FolderRepository,
    private readonly postKeywordsRepository: PostKeywordsRepository,

    private readonly awsLambdaService: AwsLambdaService,
    private readonly aiClassificationService: AiClassificationService,
    private readonly config: ConfigService,
  ) {}

  async listPost(userId: string, query: ListPostQueryDto) {
    const [count, posts] = await Promise.all([
      this.postRepository.getUserPostCount(userId, query.favorite),
      this.postRepository.listPost(
        userId,
        query.page,
        query.limit,
        query.favorite,
        query.order,
      ),
    ]);

    const postsWithKeyword = await this.organizeFolderWithKeywords(posts);

    return {
      count,
      posts: postsWithKeyword,
    };
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<boolean> {
    const { title, content } = await parseLinkTitleAndContent(
      createPostDto.url,
    );

    const userFolders = await this.folderRepository.findByUserId(userId);
    const folders = userFolders.map((folder) => {
      return {
        id: folder._id.toString(),
        name: folder.name,
      };
    });

    const postId = await this.postRepository.createPost(
      userId,
      createPostDto.folderId,
      createPostDto.url,
      title,
    );
    const payload = {
      url: createPostDto.url,
      postContent: content,
      folderList: folders,
      postId,
      userId,
    } satisfies AiClassificationPayload;

    await this.executeAiClassification(payload);

    return true;
  }

  /**
   * @todo
   * post 조회하는 플로우까지 개발되면 읽지 않음 여부 필터 적용하기
   */
  async findByFolderId(
    userId: string,
    folderId: string,
    query: GetPostQueryDto,
  ) {
    await this.folderRepository.findOneOrFail({
      _id: folderId,
      userId,
    });

    const count = await this.postRepository.getCountByFolderId(folderId);
    const posts = await this.postRepository.findByFolderId(
      folderId,
      query.page,
      query.limit,
      query.order,
    );

    const postsWithKeyword = await this.organizeFolderWithKeywords(posts);

    return {
      count,
      posts: postsWithKeyword,
    };
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    // Find if user post exist
    await this.postRepository.findPostOrThrow(userId, postId);

    // Update post data
    await this.postRepository.updatePost(userId, postId, dto);

    return true;
  }

  async updatePostFolder(
    userId: string,
    postId: string,
    dto: UpdatePostFolderDto,
  ) {
    // Find if post exist
    await this.postRepository.findPostOrThrow(userId, postId);

    // Update post folder id
    await this.postRepository.updatePostFolder(userId, postId, dto.folderId);

    //return response;
    return true;
  }

  async deletePost(userId: string, postId: string) {
    // Find if post is user's post. If it's not throw NotFoundError
    const post = await this.postRepository.findPostOrThrow(userId, postId);
    await this.postRepository.deletePost(
      userId,
      postId,
      post.aiClassificationId?.toString(),
    );
    return true;
  }

  async removeAllPostsInCustomFolders(userId: string) {
    const customFolders = await this.folderRepository.findByUserId(userId);
    const customFolderIds = customFolders
      .filter((folder) => folder.type === FolderType.CUSTOM)
      .map((folder) => folder._id);

    await this.postRepository.deleteMany({
      userId,
      folderId: { $in: customFolderIds },
    });
  }

  private async organizeFolderWithKeywords(
    posts: (FlattenMaps<Post> & { _id: Types.ObjectId })[],
  ) {
    const postIds = posts.map((post) => post._id.toString());
    const postKeywords =
      await this.postKeywordsRepository.findKeywordsByPostIds(postIds);
    const postKeywordMap: Record<
      string,
      (Keyword & { _id: Types.ObjectId })[]
    > = {};

    postKeywords.forEach((postKeyword) => {
      const postId = postKeyword.postId.toString();
      if (!postKeywordMap[postId]) {
        postKeywordMap[postId] = [];
      }

      /**
       * populate때문에 강제형변환
       */
      const keyword = postKeyword.keywordId as any as Keyword & {
        _id: Types.ObjectId;
      };
      postKeywordMap[postId].push(keyword);
    });

    const postsWithKeyword = posts.map((post) => ({
      ...post,
      keywords: postKeywordMap[post._id.toString()] ?? [],
    }));

    return postsWithKeyword;
  }

  private async executeAiClassification(payload: AiClassificationPayload) {
    if (IS_LOCAL) {
      return await this.aiClassificationService.execute(payload);
    }

    const aiLambdaFunctionName = this.config.get<string>(
      'LAMBDA_FUNCTION_NAME',
    );

    await this.awsLambdaService.invokeLambda(aiLambdaFunctionName, payload);
  }
}
