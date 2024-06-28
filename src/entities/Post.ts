import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Tag } from './Tag';
import { Comment } from './Comment';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, type: 'varchar' })
  title: string;

  @Column({ length: 1000, type: 'varchar' })
  description: string;

  @ManyToOne(() => User, (user) => user.post)
  user: User;

  @ManyToMany(() => Tag, (tags) => tags.posts)
  @JoinColumn()
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
