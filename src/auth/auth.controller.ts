import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { MSG_ERROR } from 'src/vars';
import { UserService } from 'src/users/user.service';
import { UserAlreadyExistsException } from 'src/common/exceptions';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { AuthGuardLocal } from './guards';
import { SignInUserResponseDto } from 'src/users/dto/signin-response.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @UseGuards(AuthGuardLocal)
  @Post('signin')
  login(@AuthUser() user: User): Promise<SignInUserResponseDto> {
    return this.authService.signin(user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    if (
      await this.usersService.findOne({ where: { email: createUserDto.email } })
    ) {
      throw new UserAlreadyExistsException({ message: MSG_ERROR.uExists });
    }
    const { password, ...user } = await this.usersService.signUp(createUserDto);
    return instanceToPlain(user);
  }
}
