import {
  Body,
  Controller,
  HttpException,
  Inject,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, createUserDto } from './authDtos/createUserDto';
import { sendResponse } from 'src/helpers/sendResponse';
import express, { Response } from 'express';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(@Inject('USER_SERVICE') private authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async registerUser(
    @Res() res: Response,
    @Body() createUserDto: createUserDto,
  ): Promise<any | undefined> {
    try {
      const data = await this.authService.registerUser(createUserDto);
      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.status);
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async loginUser(
    @Res() res: express.Response,
    @Body() LoginUserDto: LoginUserDto,
  ): Promise<any | undefined> {
    try {
      const data = await this.authService.loginUser(LoginUserDto);
      return res.status(201).json(data);
    } catch (err) {
      console.log('I reach here');
      throw new HttpException(err.message, 401);
    }
  }
}
