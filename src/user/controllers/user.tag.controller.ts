import {
  Body,
  Controller,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTagDto } from '../dtos/createTagDto';
import { Request, Response } from 'express';
import { UserTagService } from '../services/user.tag.service';

@Controller()
export class UserTagController {
  constructor(private readonly usertagService: UserTagService) {}

  @UsePipes(ValidationPipe)
  @Post('tag')
  async createTagPost(
    @Req() req: Request,
    @Res() res: Response,
    @Body() CreateTagDto: CreateTagDto,
  ) {
    try {
      const userId = req.user.user_id;

      const requestObject = {
        userId,

        CreateTagDto,
      };
      const data = await this.usertagService.createTag(requestObject);
      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }
}
