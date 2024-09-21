import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from 'src/heplers/hash';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({
      select: { username: true, email: true, password: true, id: true },
      where: { username },
    });
    if (user && (await verifyHash(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(user: User) {
    const { username, id: sub } = user;
    // Возвращаю токен
    return {
      access_token: await this.jwtService.signAsync(
        { username, sub },
        { expiresIn: '24h' },
      ),
    };
  }
}
