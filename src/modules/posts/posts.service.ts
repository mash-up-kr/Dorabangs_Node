import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { AwsLambdaService } from '@src/infrastructure/aws-lambda/aws-lambda.service';
import { parseLinkTitleAndContent } from '@src/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsLambdaService: AwsLambdaService,
    private readonly postRepository: PostsRepository,
    private readonly config: ConfigService,
  ) {}
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<boolean> {
    const { title, content } = await parseLinkTitleAndContent(
      createPostDto.url,
    );

    const aiLambdaFunctionName = this.config.get<string>(
      'LAMBDA_FUNCTION_NAME',
    );
    const payload = {
      postContent: content,
      folderList: ['dummy_folder_list'],
    };
    await this.awsLambdaService.invokeLambda(aiLambdaFunctionName, payload);
    return await this.postRepository.createPost(
      userId,
      createPostDto.folderId,
      createPostDto.url,
      title,
    );
  }
}
