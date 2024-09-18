import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfigFactory } from 'src/config/jwt-config.factory';
import { UserModule } from 'src/users/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StrategyJWT } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

import { PasswordService } from './password.service';
import { CookieService } from './cookie.service';


@Module({
  imports: [
    forwardRef(() => UserModule),
    // Для работы стратегий
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigFactory
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, StrategyJWT, JwtConfigFactory],
  exports: [AuthService]
})
export class AuthModule { }
