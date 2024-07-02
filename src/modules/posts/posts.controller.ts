import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostsService } from '@src/modules/posts/posts.service';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { GetUser, PaginationQuery } from '@src/common';
import { JwtGuard } from '@src/modules/users/guards';
import { CreatePostDocs } from '@src/modules/posts/docs/createPost.docs';
import { PostListResponse } from '@src/modules/posts/response/post-list.response';
import { GetPostListDocs } from '@src/modules/posts/docs/getPost.docs';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @GetPostListDocs
  @Get()
  @ApiQuery({
    name: 'isFavorite',
    required: false,
  })
  async getPost(
    @GetUser('id') userId: string,
    @Query() pagingQuery: PaginationQuery,
    @Query('isFavorite') is_favorite?: boolean,
  ): Promise<PostListResponse> {
    const { postDtoList, postCount } = await this.postsService.getPost(
      userId,
      pagingQuery,
      is_favorite,
    );
    return new PostListResponse(postDtoList, postCount);
  }
  @Post()
  @CreatePostDocs
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id') userId: string,
  ): Promise<boolean> {
    return await this.postsService.createPost(createPostDto, userId);
  }
}
