import { IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsString()
  @Length(5, 1000)
  description: string;
}
