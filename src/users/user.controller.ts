import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { UserAlreadyExistsException } from '../common/exceptions';
import { MSG_ERROR } from '../vars';
import { WishService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wishes.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { AuthGuardJWT } from 'src/auth/guards';

import { EntityNotFoundFilter } from '../common/exceptions';
import { UserProfileResponseDto } from './dto/profile-response.dto';
import { ValidUser } from './guards';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly wishService: WishService
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (await this.userService.findOne(
      { where: { email: createUserDto.email } }
    )) {
      throw new UserAlreadyExistsException({ message: MSG_ERROR.uExists })
    }
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuardJWT)
  @Get('me')
  async findOwn(@AuthUser() user: User): Promise<UserProfileResponseDto> {
    const foundUser = await this.userService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true, avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return foundUser;
  }

  @UseGuards(AuthGuardJWT)
  @Patch('me')
  @UseFilters(EntityNotFoundFilter)
  async updateOne(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const { id } = user;
    return this.update(String(id), updateUserDto)
  }

  @UseGuards(AuthGuardJWT)
  @Get('me/wishes')
  async findMyWish(@AuthUser() user: User): Promise<Wish[]> {
    return await this.getUserWishes(user, '')
  }

  @UseGuards(AuthGuardJWT)
  @Get(':username')
  findOne(
    @Param('username') username: string
  ) {
    return this.userService.findOne({
      where: { username },
      select: {
        id: true, avatar: true,
        username: true,
        about: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  @UseGuards(AuthGuardJWT)
  @Get(':username/wishes')
  getUserWishes(
    @AuthUser() user: User,
    @Param('username') username: string
  ) {

    if (username === '') {
      username = user.username
    }

    return this.wishService.find(
      { where: { owner: { username } } }
    )
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userService.findOne({
      where: { id: +id }
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuardJWT)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(
      { where: { id: +id } },
      updateUserDto
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuardJWT)
  remove(
    @Param('id') id: string,
    @AuthUser() user: User
  ) {
    return this.userService.removeOne({ id: +id }, user.id);
  }
}
