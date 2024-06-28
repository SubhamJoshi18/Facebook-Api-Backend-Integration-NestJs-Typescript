import { User } from 'src/entities/User';
import { LoginUserDto, createUserDto } from './authDtos/createUserDto';

export interface AuthServiceInterface {
  registerUser: (createUserDto: createUserDto) => Promise<User | any>;
  loginUser: (LoginUserDto: LoginUserDto) => Promise<object | any>;
}
