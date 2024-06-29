import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PostsService } from '@src/modules/posts/posts.service';
import { CreatePostDto } from '@src/modules/posts/dto/create-post.dto';
import { GetUser } from '@src/common';
import { JwtGuard } from '@src/modules/users/guards';
import { CreatePostDocs } from '@src/modules/posts/docs/createPost.docs';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {
    this.postsService = postsService;
  }

  @Post()
  @CreatePostDocs
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id') userId: Types.ObjectId,
  ): Promise<boolean> {
    return await this.postsService.createPost(createPostDto, userId);
  }
}
