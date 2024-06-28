import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: false })
  receivedNotifications: boolean;

  @Column({ default: false })
  receivedEmail: boolean;

  @Column({ default: false })
  active_status: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
