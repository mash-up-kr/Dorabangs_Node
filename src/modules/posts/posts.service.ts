import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { AwsLambdaService } from '@src/infrastructure/aws-lambda/aws-lambda.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsLambdaService: AwsLambdaService,
    private readonly postRepository: PostsRepository,
  ) {}
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<boolean> {
    // TODO get title from url
    const title: string = 'temp title';

    // TODO lambda function name
    // const ai_lambda_function_name = 'ai_lambda_function_name';
    // const payload = {
    //   postContent: 'contents',
    //   folderList: ['dummy_folder_list'],
    // };
    // this.awsLambdaService.invoke_lambda(ai_lambda_function_name, payload);

    return await this.postRepository.createPost(
      userId,
      createPostDto.folderId,
      createPostDto.url,
      title,
    );
  }
}
