import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ExecutionContext,
  Get,
  HttpException,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { CreateSettingDto } from '../dtos/createSetting-dto';
import { sendResponse } from 'src/helpers/sendResponse';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { UpdateUserDto } from '../dtos/updateUserdto';

type AllPosssibleError = Error | JsonWebTokenError | any;
@Controller('user')
@SerializeOptions({ strategy: 'excludeAll' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Patch('setting')
  async createSetting(
    @Req() req: Request,
    @Res() res: Response,
    @Body() CreateSettingDto: CreateSettingDto,
  ): Promise<any> {
    try {
      const userId = req.user.user_id;
      const data = await this.userService.createSetting(
        userId,
        CreateSettingDto,
      );
      return sendResponse(res, 201, 'Settig Updated SuccessFully', data);
    } catch (err: AllPosssibleError) {
      console.log(err);
      throw new HttpException(err.message, 401);
    }
  }

  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.user.user_id;
      const data = await this.userService.getUserProfile(userId);
      return sendResponse(res, 201, 'User Profile', data);
    } catch (err: AllPosssibleError) {
      console.log(err);
      throw new HttpException(err.message, 401);
    }
  }

  @Post('create')
  async createUserSetting(
    @Req() req: Request,
    @Res() res: Response,
    @Body() CreateSettingDto: CreateSettingDto,
  ) {
    try {
      const userId = req.user.user_id;
      const data = await this.userService.createSetting(
        userId,
        CreateSettingDto,
      );
      return sendResponse(res, 201, 'Saved SuccessFully', data);
    } catch (err: AllPosssibleError) {
      throw new HttpException(err.message, 401);
    }
  }

  @Patch('activate')
  async activateAccount(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.user.user_id;
      const data = await this.userService.reactivateAccount(userId);
      return res.status(201).json({
        data: data,
        message: 'hi',
      });
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Patch('deactivate')
  async deactivateAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Query('active_status') active_status: boolean,
  ) {
    try {
      const userId = req.user.user_id;
      const data = await this.userService.deactivateAccount(userId);
      return res.status(201).json({
        data: data,
        message: 'hi',
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }

  @UsePipes(ValidationPipe)
  @Put('update')
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    try {
      const userId = req.user.user_id;
      const data = await this.userService.updateUser(userId, UpdateUserDto);
      return res.status(201).json(data);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
