import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
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
import { FindUsersDto } from './dto/find-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly wishService: WishService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.userService.findOne({ where: { email: createUserDto.email } })
    ) {
      throw new UserAlreadyExistsException({ message: MSG_ERROR.uExists });
    }
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuardJWT)
  @Post('find')
  async findMany(@Body() findUserDto: FindUsersDto): Promise<User[]> {
    try {
      const users = await this.userService.find({
        where: [{ username: findUserDto.query }, { email: findUserDto.query }],
        select: {
          email: true,
          username: true,
          id: true,
          avatar: true,
          about: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!users) throw new BadRequestException(MSG_ERROR.eget);
      return users;
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eget);
    }
  }

  @UseGuards(AuthGuardJWT)
  @Get('me')
  async findOwn(@AuthUser() user: User): Promise<User> {
    const foundUser = await this.userService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return foundUser;
  }

  @UseGuards(AuthGuardJWT)
  @Patch('me')
  @UseFilters(EntityNotFoundFilter)
  async updateOne(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = user;
    return this.update(String(id), updateUserDto, user);
  }

  @UseGuards(AuthGuardJWT)
  @Get('me/wishes')
  async getOwnWishes(@AuthUser() user: User): Promise<Wish[]> {
    const { username } = user;
    return this.wishService.find({
      where: { owner: { username } },
      relations: ['owner', 'offers'],
    });
  }

  @UseGuards(AuthGuardJWT)
  @Get(':username')
  @UseFilters(EntityNotFoundFilter)
  findOne(@Param('username') username: string) {
    return this.userService.findOne({
      where: { username },
      select: {
        id: true,
        avatar: true,
        username: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @UseGuards(AuthGuardJWT)
  @Get(':username/wishes')
  getMyWishes(@Param('username') username: string | null) {
    return this.wishService.find({
      where: { owner: { username } },
      relations: ['offers'],
    });
  }

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  findOneById(@Param('id') id: string) {
    try {
      return this.userService.findOne({
        where: { id: +id },
      });
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eget);
    }
  }

  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  @UseGuards(AuthGuardJWT)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: User,
  ) {
    try {
      return this.userService.update(
        { where: { id: +id } },
        updateUserDto,
        user,
      );
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eupdate);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuardJWT)
  @UseFilters(EntityNotFoundFilter)
  remove(@Param('id') id: string, @AuthUser() user: User) {
    try {
      return this.userService.removeOne({ id: +id }, user.id);
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.edel);
    }
  }
}
