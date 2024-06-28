import { CreateTagDto } from './../dtos/createTagDto';
import { UpdatePostDto } from './../dtos/updatePostDto';

export interface IRequestobject {
  userId: number;
  postId: number;
  UpdatePostDto: UpdatePostDto;
}

export interface ICreateTagRequest {
  userId: number;
  CreateTagDto: CreateTagDto;
}
