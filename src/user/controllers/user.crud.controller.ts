import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserCrudService } from '../services/user.crud.service';
import { Request, Response } from 'express';
import { PostDto } from '../dtos/postDto';
import { UpdatePostDto } from '../dtos/updatePostDto';

@Controller('user')
export class UserCrudController {
  constructor(private readonly UserCrudService: UserCrudService) {}
  @Post('post')
  async postBlog(
    @Req() req: Request,
    @Res() res: Response,
    @Body() PostDto: PostDto,
  ) {
    try {
      const userId = Object.keys(req).length > 0 ? req.user.user_id : null;
      const data = await this.UserCrudService.postBlog(userId, PostDto);
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('user/post')
  async getAllUserBlog(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = Object.keys(req).length > 0 ? req.user.user_id : null;
      const data = await this.UserCrudService.getUserBlog(userId);
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('allpost')
  async getAllPost(@Res() res: Response) {
    try {
      const data = await this.UserCrudService.getAllPosts();
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Patch('update/:id')
  async updatePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdatePostDto: UpdatePostDto,
  ) {
    try {
      const userId = Object.entries(req).length > 0 ? req.user.user_id : null;
      const postId = typeof id === 'number' ? id : null;
      const requestObject = {
        userId,
        postId,
        UpdatePostDto,
      };
      const data = await this.UserCrudService.updatePost(requestObject);
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Delete('delete/:id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.user_id;
      const postId = typeof id === 'number' ? id : undefined;
      const data = await this.UserCrudService.deletePost(userId, postId);
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
