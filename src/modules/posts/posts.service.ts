import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseLinkTitleAndContent } from '@src/common';
import { Post } from '@src/infrastructure';
import { AwsLambdaService } from '@src/infrastructure/aws-lambda/aws-lambda.service';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { PostAiStatus } from '@src/modules/posts/posts.constant';
import { PostsRepository } from '@src/modules/posts/posts.repository';
import { Types } from 'mongoose';
import { FolderRepository } from '../folders/folders.repository';
import { ListPostQueryDto, UpdatePostDto, UpdatePostFolderDto } from './dto';
import { GetPostQueryDto } from './dto/find-in-folder.dto';

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
      this.postRepository.getUserPostCount(
        userId,
        query.favorite,
        query.isRead,
      ),
      this.postRepository.listPost(
        userId,
        query.page,
        query.limit,
        query.favorite,
        query.order,
        query.isRead,
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
  ): Promise<Post & { _id: Types.ObjectId }> {
    // NOTE : URL에서 얻은 정보 가져옴
    const { title, content, thumbnail } = await parseLinkTitleAndContent(
      createPostDto.url,
    );

    const userFolderList = await this.folderRepository.findByUserId(userId);
    const folderList = userFolderList.map((folder) => {
      return {
        id: folder._id.toString(),
        name: folder.name,
      };
    });
    const post = await this.postRepository.createPost(
      userId,
      createPostDto.folderId,
      createPostDto.url,
      title,
      thumbnail,
      PostAiStatus.IN_PROGRES,
    );
    const payload = {
      postContent: content,
      folderList: folderList,
      postId: post._id.toString(),
    };

    const aiLambdaFunctionName = this.config.get<string>(
      'LAMBDA_FUNCTION_NAME',
    );
    await this.awsLambdaService.invokeLambda(aiLambdaFunctionName, payload);
    return post;
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
    const count = await this.postRepository.getCountByFolderId(
      folderId,
      query.isRead,
    );
    const posts = await this.postRepository.findByFolderId(
      folderId,
      offset,
      query.limit,
      query.isRead,
    );

    return { count, posts };
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    // Find if user post exist
    await this.postRepository.findPostOrThrow({
      _id: postId,
      userId: userId,
    });

    // Update post data
    await this.postRepository.updatePost(userId, postId, dto);
    const post = await this.postRepository.findPostOrThrow({
      _id: postId,
    });
    return post;
  }

  async updatePostFolder(
    userId: string,
    postId: string,
    dto: UpdatePostFolderDto,
  ) {
    await this.folderRepository.findOneOrFail({
      userId: userId,
      id: dto.folderId,
    });

    // Find if post exist
    await this.postRepository.findPostOrThrow({
      _id: postId,
      userId: userId,
    });

    // Update post folder id
    await this.postRepository.updatePostFolder(userId, postId, dto.folderId);

    //return response;
    return true;
  }

  async deletePost(userId: string, postId: string) {
    // Find if post is user's post. If it's not throw NotFoundError
    const post = await this.postRepository.findPostOrThrow({
      _id: postId,
      userId: userId,
    });
    await this.postRepository.deletePost(
      userId,
      postId,
      post.aiClassificationId?.toString(),
    );
    return true;
  }
}
