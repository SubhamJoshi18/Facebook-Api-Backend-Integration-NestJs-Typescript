import { UpdateUserDto } from '../dtos/updateUserdto';
import { CreateSettingDto } from '../dtos/createSetting-dto';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { UserProfile } from 'src/entities/UserProfile';
import { Repository } from 'typeorm';
import { UserInterface } from '../interface/user.service.interface';
import { from } from 'rxjs';
interface responseObject {
  status: number;
  message: string;
  current_status: any;
}
enum activeStatusConstant {
  ON = '1',
  OFF = '0',
}
@Injectable()
export class UserService implements UserInterface {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createSetting(
    userId: string | number,
    CreateSettingDto: CreateSettingDto,
  ): Promise<string | any | undefined> {
    const checkUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getOne();

    if (Object.entries(checkUser).length == 0 || !checkUser.hasId()) {
      throw new HttpException('User Not Found', 401);
    }

    const testMap = new Map([[`userId`, `${checkUser.id}`]]);
    // const profileUser = await this.userProfileRepository.findOne({
    //   where: {
    //     user: checkUser,
    //   },
    // });
    // if (
    //   profileUser.receivedEmail ||
    //   profileUser.receivedNotifications ||
    //   profileUser.active_status
    // ) {
    //   throw new HttpException(
    //     'The Follwing Profile Setting is already True',
    //     401,
    //   );
    // }
    const userProfile = await this.userProfileRepository
      .createQueryBuilder()
      .insert()
      .into(UserProfile)
      .values([
        {
          receivedEmail: CreateSettingDto.receivedEmail,
          receivedNotifications: CreateSettingDto.receivedNotifications,
          active_status: CreateSettingDto.active_status,
          user: checkUser,
        },
      ])
      .execute();
    if (testMap.get(`userId`) !== checkUser.id.toString())
      throw new HttpException('ID does not match', 402);

    const updateData: Partial<UserProfile> = {};
    if (CreateSettingDto.receivedEmail !== undefined) {
      updateData.receivedEmail = CreateSettingDto.receivedEmail;
    }
    if (CreateSettingDto.receivedNotifications !== undefined) {
      updateData.receivedNotifications = CreateSettingDto.receivedNotifications;
    }

    await this.userProfileRepository
      .createQueryBuilder()
      .update(UserProfile)
      .set(updateData)
      .where('user.id = :userId', { userId: checkUser.id })
      .execute();

    return { message: 'User Profile Updated SuccesFully' };
  }

  async getUserProfile(
    userId: string | number,
  ): Promise<UserProfile | any | User> {
    const users = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });
    return users;
  }

  async createUserProfile(
    userId: string | number,
    CreateSettingDto: CreateSettingDto,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
    });

    const countUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :userId', { id: userId })
      .getCount();

    if (countUser === 0 || !user) {
      throw new HttpException('User Not Found', 401);
    }

    const profile = new UserProfile();
    profile.receivedNotifications = CreateSettingDto.receivedNotifications;
    profile.receivedEmail = CreateSettingDto.receivedEmail;
    profile.active_status = CreateSettingDto.active_status;

    user.profile = profile;
    await this.userRepository.save(profile);
    await this.userProfileRepository.save(profile);
    return { message: 'User Profile Saved SuccessFully' };
  }

  async reactivateAccount(userId: string | number): Promise<any> {
    const checkUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: userId })
      .getOne();

    const emptySet = new Set([checkUser]);
    if (emptySet.size == 0 || Object.entries(checkUser).length == 0) {
      throw new HttpException('No User Found', 401);
    }
    // const select_user = await this.userProfileRepository
    //   .createQueryBuilder()
    //   .select('userProfile')
    //   .from(UserProfile, 'userProfile')
    //   .where('userId = :userId', { userId: userId })
    //   .getOne();

    const user = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });

    // const selectUser = await this.userProfileRepository
    //   .createQueryBuilder()
    //   .where('userId = :userId', { userId: userId })
    //   .getOne();

    // if (!selectUser) {
    //   throw new HttpException('User profile not found', 401);
    // }
    // console.log(selectUser);
    // let emptyObject: Partial<responseObject> = {};
    // const check_active_status = selectUser.active_status
    //   ? (emptyObject.current_status = activeStatusConstant.ON)
    //   : (emptyObject.current_status = activeStatusConstant.OFF);

    if (user.profile.active_status) {
      throw new HttpException(
        'Active Status is already True ,Invalid Operation',
        401,
      );
    }

    const result: any = await this.userProfileRepository
      .createQueryBuilder()
      .update(UserProfile)
      .set({
        active_status: true,
      })
      .where('userId = :userId', { userId: userId })
      .execute();

    console.log(result);
    let message;
    if (result?.affected > 0) {
      message = `Your Account is SuccessFully Activated`;
    }
    return message;
  }

  async deactivateAccount(user_id: string | number): Promise<any> {
    const findUser = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id: user_id })
      .getOne();

    if (!findUser) throw new NotFoundException();
    const user = await this.userRepository.findOne({
      where: { id: Number(user_id) },
      relations: ['profile'],
    });
    if (!user.profile.active_status) {
      throw new HttpException('Active Status is already False ,', 401);
    }

    const result: any = await this.userRepository
      .createQueryBuilder()
      .update(UserProfile)
      .set({
        active_status: false,
      })
      .where('userId = :userId', { userId: user_id })
      .execute();

    console.log(result);
    let message;
    if (result?.affected > 0) {
      message = `Your Account is SuccessFully Deactivated`;
    }
    return message;
  }

  async updateUser(userId: string | number, UpdateUserDto: UpdateUserDto) {
    const checkUser = await this.userRepository.findOne({
      where: {
        id: Number(userId),
      },
      relations: ['profile'],
    });
    if (!checkUser.hasId()) throw new HttpException('User Not Found', 401);
    let userMap = new Map([[`${userId}`, `${checkUser.id}`]]);
    if (userMap.get(`${userId}`) !== checkUser.id.toString())
      throw new HttpException('The map Id is not equal to user id', 401);

    let udpdatedata: Partial<User> = {};
    if (UpdateUserDto.email !== undefined) {
      udpdatedata.email = UpdateUserDto.email;
    }
    if (UpdateUserDto.username !== undefined) {
      udpdatedata.username = UpdateUserDto.username;
    }
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(udpdatedata)
      .where('id = :id', { id: checkUser.hasId() ? checkUser.id : null })
      .execute();

    if (result.affected == 0) {
      throw new HttpException('No change were made', 401);
    }

    const message = `${checkUser.username} Has Been Updated SuccessFully`;
    return message;
  }
}
