import { UserProfile } from 'src/entities/UserProfile';
import { CreateSettingDto } from '../dtos/createSetting-dto';
import { User } from 'src/entities/User';

export interface UserInterface {
  createSetting: (
    userID: string | number,
    createSettingDto: CreateSettingDto,
  ) => Promise<string | undefined>;

  getUserProfile: (userId: string | number) => Promise<UserProfile | User>;

  createUserProfile: (
    userId: string | number,
    createSettingDto: CreateSettingDto,
  ) => Promise<any>;
}
