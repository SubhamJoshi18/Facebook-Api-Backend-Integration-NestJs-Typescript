import { createUserDto, LoginUserDto } from './authDtos/createUserDto';
import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { AuthServiceInterface } from './auth.service.interface';
import * as EmailValidator from 'email-validator';
import * as bcrypt from 'bcryptjs';
import { GlobalExceptionFilter } from 'src/httpException/globalHttpException';
import { IPayload } from './types/interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: createUserDto): Promise<User | any> {
    const checkExistsUser: any = await this.userRepository
      .createQueryBuilder()
      .where('username =  :username', { username: createUserDto.username })
      .getOne();

    if (checkExistsUser) {
      throw new BadRequestException(
        'User or Email You have Entered Already Exists',
      );
    }
    const validateEmail = EmailValidator.validate(createUserDto.email);
    console.log(validateEmail);
    if (!validateEmail)
      throw new BadGatewayException('Email is not a valid Email');
    const checkUserName = createUserDto.username.length > 3;
    if (!checkUserName)
      throw new BadGatewayException('User name must be greater than 3');
    const salt = 10;
    const genSalt = await bcrypt.genSalt(salt);
    if (genSalt.toString().length < 9)
      throw new BadRequestException(`${salt} cannot be generated`);
    const hashPassword = await bcrypt.hash(createUserDto.password, genSalt);

    const checkResponse = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          email: createUserDto.email,
          password: hashPassword,
          username: createUserDto.username,
        },
      ])
      .execute();
    const message = `${createUserDto.username} Has Been Registered SuccessFully`;
    return message;
  }

  async loginUser(LoginUserDto: LoginUserDto): Promise<object | any> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where('username= :username', { username: LoginUserDto.username })
      .getOne();

    if (!user)
      throw new NotFoundException(
        `The Username You entered ${LoginUserDto.username} Does not Exists`,
      );

    const checkPasword = await bcrypt.compare(
      LoginUserDto.password,
      user.password,
    );

    console.log(checkPasword);

    if (!checkPasword)
      throw new UnauthorizedException('Password Does not Match');

    const payload: IPayload = {
      email: user.email,
      username: user.username,
      user_id: user.id,
    };

    const accessToken = this.jwtService.sign(payload);
    const responseObj: object | any = {
      accessToken,
      user_name: user.username,
      user_id: user.id,
    };
    return responseObj;
  }
}
