import { PostDto } from './../dtos/postDto';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { User } from 'src/entities/User';
import { UserProfile } from 'src/entities/UserProfile';
import { In, Repository } from 'typeorm';
import { IRequestobject } from '../interface/types';
import { Tag } from 'src/entities/Tag';
import { find } from 'rxjs';

type StringNum = string | number | null;

@Injectable()
export class UserCrudService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  async postBlog(userId: StringNum, PostDto: PostDto) {
    const verifyUser = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });
    if (!verifyUser.profile.active_status)
      throw new HttpException(
        'Please Activate Your Account To Post Blogs',
        401,
      );
    // const tags = await this.tagRepository.find({
    //   where: PostDto.tagIds.map((id) => ({ id })),
    // });
    const tags = await this.tagRepository.findBy({
      id: In(PostDto.tagIds),
    });
    console.log(tags);

    if (tags.length !== PostDto.tagIds.length) {
      throw new HttpException('Some tags not found', 401);
    }

    const { identifiers, generatedMaps, raw } = await this.postRepository
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values([
        {
          title: PostDto.title,
          description: PostDto.description,
          user: verifyUser,
          tags: tags,
        },
      ])
      .execute();
    if (identifiers[0].id == 0 || generatedMaps[0].id == 0 || raw[0].id == 0) {
      throw new HttpException('Internal Issue while saving The Blog', 401);
    }
    const message = `${verifyUser.username} Has Posted A Blog With ${PostDto.title} As a Title`;
    return message;
  }

  async getUserBlog(userId: StringNum) {
    const verifyUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getCount();

    if (verifyUser.toString().startsWith('0'))
      throw new HttpException('User Not Found', 401);
    const user = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });

    const postUser: any = await this.postRepository.find({
      where: {
        user: user,
      },
    });
    const filteredArr = postUser.map(({ ...rest }) => rest);
    return filteredArr;
  }

  async getAllPosts() {
    const findAllPost = await this.postRepository.find({
      relations: ['tags'],
    });
    console.log(findAllPost);
    const filterData = findAllPost.map(({ description, ...rest }) => rest);
    return filterData;
  }

  async deletePost(userId: StringNum, postId: number) {
    const checkUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getCount();

    if (!checkUser || checkUser.toString().startsWith('0'))
      throw new HttpException('User not found', 401);

    const findUser = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });
    if (Object.entries(findUser).length === 0)
      throw new HttpException('User is Empty', 401);

    const existPost = await this.postRepository
      .createQueryBuilder()
      .where('id = :id', { id: postId })
      .getOne();
    console.log(existPost);

    if (!existPost)
      throw new HttpException(
        'Post does not exists or it is already deleted',
        401,
      );
    const result = await this.postRepository
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where('id = :id', { id: postId })
      .execute();
    const affectRow = result.affected > 0 ? result.affected : 0;
    console.log(affectRow);
    if (affectRow.toString().startsWith('0'))
      throw new HttpException('Delete Operation Failed', 401);

    const message = {
      message: `${findUser.username} Has Deleted ${existPost.title} SuccessFully`,
    };
    return message;
  }

  async updatePost({ userId, postId, UpdatePostDto }: IRequestobject) {
    const validateUser = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });
    if (!validateUser.profile.active_status)
      throw new HttpException('User Is Deactivated', 403);
    if (
      Object.keys(UpdatePostDto).length == 0 ||
      Object.values(UpdatePostDto).length == 0
    )
      throw new HttpException('There is no anything to be Updated', 401);
    let updateData: Partial<Post> = {};
    if (UpdatePostDto.title !== undefined) {
      updateData.title = UpdatePostDto.title;
    }
    if (UpdatePostDto.description !== undefined) {
      updateData.description = UpdatePostDto.description;
    }

    const result = await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set(updateData)
      .where('id = :id', { id: postId })
      .execute();

    const rowAffected = result.affected > 0 ? result.affected : 0;
    if (rowAffected.toString().startsWith('0'))
      throw new HttpException('Delete Operation Failed', 401);
    const message = {
      message: `${validateUser.username} Has Updated ${updateData.title} SuccessFully`,
    };
    return message;
  }
}
