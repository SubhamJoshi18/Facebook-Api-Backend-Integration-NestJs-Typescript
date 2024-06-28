import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { Tag } from 'src/entities/Tag';
import { User } from 'src/entities/User';
import { UserProfile } from 'src/entities/UserProfile';
import { Repository } from 'typeorm';
import { ICreateTagRequest } from '../interface/types';

@Injectable()
export class UserTagService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Tag) private tagRepostiory: Repository<Tag>,
  ) {}

  async createTag({ userId, CreateTagDto }: ICreateTagRequest) {
    const checkUser = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });

    const existsUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getCount();
    if (existsUser.toString().startsWith('0') || existsUser === 0)
      throw new HttpException('User is Empty', 401);

    const tagData: Partial<Tag> = CreateTagDto.name
      ? { name: CreateTagDto.name }
      : {};
    if (Object.entries(tagData).length === 0)
      throw new HttpException('Tag Is Not Provided', 401);
    const result = await this.tagRepostiory
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values([
        {
          name: tagData.name,
        },
      ])
      .execute();

    console.log(result);
    const affectedTagMessage =
      result.raw[0].id > 0
        ? `${checkUser.username} Has Insert A New Tag ${CreateTagDto.name}`
        : 'Tag is not inserted';
    return affectedTagMessage;
  }
}
