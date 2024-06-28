import {
  Body,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateCommentDto } from '../dtos/createCommentDto';
import { Request, Response } from 'express';
import { UserCommentService } from '../services/user.comment.service';

@Controller('user')
export class UserCommentController {
  constructor(private readonly userCommentService: UserCommentService) {}
  @Post('comment/:id')
  async createComment(
    @Body() CreateCommentDto: CreateCommentDto,
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const userId = req.user.user_id;
      const data = await this.userCommentService.createComment(
        userId,
        id,
        CreateCommentDto,
      );

      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('comment/:id')
  async getCommentOfBlogUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const userId = req.user.user_id;
      const data = await this.userCommentService.getCommentOfBlogUser(
        userId,
        id,
      );
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Delete('comment/:id')
  async deleteCommentOfBlog(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const userId = req.user.user_id;
      const data = await this.userCommentService.deleteTheComment(userId, id);
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
