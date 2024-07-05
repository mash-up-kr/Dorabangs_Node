import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { GetPostQueryDto } from './dto/find-in-folder.dto';
import { FolderRepository } from '../folders/folders.repository';
import { AwsLambdaService } from '@src/infrastructure/aws-lambda/aws-lambda.service';
import { parseLinkTitleAndContent } from '@src/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly folderRepository: FolderRepository,
    private readonly awsLambdaService: AwsLambdaService,
    private readonly config: ConfigService,
  ) {}
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<boolean> {
    const { title, content } = await parseLinkTitleAndContent(
      createPostDto.url,
    );

    const ai_lambda_function_name = this.config.get<string>(
      'LAMBDA_FUNCTION_NAME',
    );
    const payload = {
      postContent: content,
      folderList: ['dummy_folder_list'],
    };
    this.awsLambdaService.invokeLambda(ai_lambda_function_name, payload);

    return await this.postRepository.createPost(
      userId,
      createPostDto.folderId,
      createPostDto.url,
      title,
    );
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

    const offset = (query.page - 1) * query.limit;
    const count = await this.postRepository.getCountByFolderId(folderId);
    const posts = await this.postRepository.findByFolderId(
      folderId,
      offset,
      query.limit,
    );

    return { count, posts };
  }
}
