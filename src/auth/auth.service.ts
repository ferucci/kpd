import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from 'src/heplers/hash';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const foundUser = await this.usersService.findOne({
      select: { username: true, email: true, password: true, id: true },
      where: { username }
    });
    if (foundUser && (await verifyHash(password, foundUser.password))) {
      const { password, ...result } = foundUser;
      return result;
    }
    return null;
  }

  async signin(user: User) {
    const { username, id: sub } = user;
    // Возвращаю токен
    return {
      access_token: await this.jwtService.signAsync({ username, sub })
    }
  }
}