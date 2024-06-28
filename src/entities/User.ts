import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './UserProfile';

import { Post } from './Post';
import { Comment } from './Comment';
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  profile: UserProfile;

  @OneToMany(() => Post, (post) => post.user, { eager: true, cascade: true })
  post: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
