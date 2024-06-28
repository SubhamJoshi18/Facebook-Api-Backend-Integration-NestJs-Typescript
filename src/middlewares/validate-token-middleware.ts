import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
declare global {
  namespace Express {
    interface Request {
      user?: any | object;
    }
  }
}

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) throw new HttpException('Invalid Authorization ', 403);
    const decoded_token: JwtPayload = jwtDecode(token);
    if (Object.entries(decoded_token).length == 0)
      throw new HttpException('Payload is Empty', 401);
    const checkUser = await this.userRepository
      .createQueryBuilder()
      .where('username= :username', { username: decoded_token.username })
      .getOne();
    try {
      const payload = await this.jwtService.verify(token, {
        secret: 'secretKey',
      });
      req.user = payload;
      next();
    } catch (err: JsonWebTokenError | any) {
      console.log('This is Json web token error' + err.message + err.status);
      throw new HttpException(err.message, err.status);
    }
  }
}
