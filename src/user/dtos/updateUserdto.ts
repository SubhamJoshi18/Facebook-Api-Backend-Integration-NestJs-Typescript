import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  email: string;

  @IsOptional()
  username: string;

  @IsOptional()
  password: string;
}
