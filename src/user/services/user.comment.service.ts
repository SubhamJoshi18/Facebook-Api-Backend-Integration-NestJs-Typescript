import { CreateCommentDto } from './../dtos/createCommentDto';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/Comment';

type CustomNumStr = number | string;

@Injectable()
export class UserCommentService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async createComment(
    userId: string | number,
    postId: number,
    CreateCommentDto: CreateCommentDto,
  ) {
    const validateUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getOne();

    if (!validateUser) throw new HttpException('User not found', 401);

    const checkPost = await this.postRepository.findOne({
      where: {
        id: Number(postId),
      },
      relations: ['comments'],
    });
    if (Object.entries(CreateCommentDto).length === 0)
      throw new HttpException('Comment Message is Empty', 401);

    const createComment = await this.commentRepository
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values([
        {
          content: CreateCommentDto.content,
          post: checkPost,
          user: validateUser,
        },
      ])
      .execute();
    if (createComment.raw[0].id === 0)
      throw new HttpException('Comment Create Operation is Failed', 401);

    const message = `${validateUser.username} Has Commented A Post`;
    return message;
  }

  async getCommentOfBlogUser(userId: string | number, postId: number) {
    const existsUser = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });

    const existsPost = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    const comment = await this.commentRepository.findOne({
      where: {
        post: existsPost,
        user: existsUser,
      },
    });

    if (!comment)
      throw new HttpException(
        `${existsUser.username} Havent Commented On This post `,
        401,
      );

    return comment;
  }

  async deleteTheComment(userId: CustomNumStr, postId: number) {
    const existsUser = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });

    const existsPost = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    const comment = await this.commentRepository.findOne({
      where: {
        post: existsPost,
        user: existsUser,
      },
    });

    if (!comment) throw new HttpException(`Comment Does Not Exists`, 401);

    const result = await this.commentRepository
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where('userId = :userId', { userId: existsUser.id })
      .andWhere('postId = :postId', { postId: existsPost.id })
      .execute();

    if (result.affected === 0)
      throw new HttpException('Delete Operation SuccessFully', 401);
    return {
      message: 'Delete Operation SuccessFully',
    };
  }
}
