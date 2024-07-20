import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { GetPostQueryDto } from './dto/find-in-folder.dto';
import { FolderRepository } from '../folders/folders.repository';
import { ListPostQueryDto, UpdatePostDto, UpdatePostFolderDto } from './dto';
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
    return {
      count,
      posts,
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
    const aiLambdaFunctionName = this.config.get<string>(
      'LAMBDA_FUNCTION_NAME',
    );
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
      postId: postId,
    };
    await this.awsLambdaService.invokeLambda(aiLambdaFunctionName, payload);
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

    const offset = (query.page - 1) * query.limit;
    const count = await this.postRepository.getCountByFolderId(folderId);
    const posts = await this.postRepository.findByFolderId(
      folderId,
      offset,
      query.limit,
    );

    return { count, posts };
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
}
