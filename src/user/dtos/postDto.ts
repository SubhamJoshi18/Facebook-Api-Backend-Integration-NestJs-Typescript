import { IsOptional, IsString, Length } from 'class-validator';

export class PostDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsString()
  @Length(5, 1000)
  description: string;

  @IsOptional()
  tagIds: number[];
}
