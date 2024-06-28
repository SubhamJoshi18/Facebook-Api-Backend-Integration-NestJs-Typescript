import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from 'src/entities/Comment';
import { Post } from 'src/entities/Post';
import { Tag } from 'src/entities/Tag';
import { User } from 'src/entities/User';
import { UserProfile } from 'src/entities/UserProfile';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'authNest',
    entities: [User, UserProfile, Post, Tag, Comment],
    synchronize: true,
  }),
);
