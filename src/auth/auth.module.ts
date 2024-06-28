import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        issuer: 'subhamJoshi',
        expiresIn: '60m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'USER_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
