import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ValidateTokenMiddleware } from 'src/middlewares/validate-token-middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { UserProfile } from 'src/entities/UserProfile';
import { Post } from 'src/entities/Post';
import { UserCrudService } from './services/user.crud.service';
import { UserCrudController } from './controllers/user.crud.controller';
import { UserTagController } from './controllers/user.tag.controller';
import { UserTagService } from './services/user.tag.service';
import { Tag } from 'src/entities/Tag';
import { Comment } from 'src/entities/Comment';
import { UserCommentController } from './controllers/user.comment';
import { UserCommentService } from './services/user.comment.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User, UserProfile, Post, Tag, Comment]),
  ],
  controllers: [
    UserController,
    UserCrudController,
    UserTagController,
    UserCommentController,
  ],
  providers: [
    UserService,
    UserCrudService,
    UserTagService,
    UserCommentService,
    JwtService,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateTokenMiddleware).forRoutes(UserController);
    consumer.apply(ValidateTokenMiddleware).forRoutes(UserCrudController);
    consumer.apply(ValidateTokenMiddleware).forRoutes(UserTagController);
    consumer.apply(ValidateTokenMiddleware).forRoutes(UserCommentController);
  }
}
