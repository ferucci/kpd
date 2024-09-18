import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UserService } from "src/users/user.service";


@Injectable()
export class StrategyJWT extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {

    console.log('auth/strategy : ', configService.get<string>('jwt.secret'))

    super({
      // Считываю заголовки
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Передаю соль
      secretOrKey: configService.get<string>('jwt.secret')
    });
  }

  async validate(payload: any) {
    return this.userService.findOne(
      { where: { id: payload.sub } }
    );
  }
}