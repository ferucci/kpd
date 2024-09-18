import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WishService } from './wishes.service';
import { CreateWishDto } from './dto/create-wishes.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuardJWT } from 'src/auth/guards';
import { Wish } from './entities/wishes.entity';
import { WishAuthorGuard } from './guards';
import { UpdateWishDto } from './dto/update-wish.dto';

// Временно на все роуты AuthGuardJWT, далее нужно исправить, чтоб на last и top не распространялись
@UseGuards(AuthGuardJWT)
@Controller('wishes')
export class WishController {
  constructor(
    private readonly wishService: WishService
  ) { }

  @Post()
  // @Roles(Role.ADMIN)
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user: User) {
    try {
      return this.wishService.create(createWishDto, user.id);
    } catch (error) {
      throw new Error('Ошибка в создании пользователя')
    }
  }

  @Get('last')
  async findLasts(): Promise<Wish[]> {
    try {
      const limit = 2;
      return this.wishService.find(
        {
          order: { createdAt: 'DESC' },
          take: limit,
        }
      );
    } catch (error) {
      throw new Error('Ошибка в получении последних записей')
    }
  }

  @Get('top')
  async findTops(): Promise<Wish[]> {
    try {
      return this.wishService.find({
        order: { copied: 'DESC' },
        take: 3
      });
    } catch (error) {
      throw new Error('Ошибка в получении популярных записей')
    }
  }

  @Get(":id")
  async findOneById(
    @AuthUser() user: User,
    @Param('id') id: string
  ): Promise<Wish> {
    try {
      const foundWish = await
        this.wishService.findOne(
          {
            where: { id: +id },
            relations: ['owner'],
          },
        )
      return foundWish;
    } catch (error) {
      throw new Error('Ошибка в получении записи по id')
    }

  }

  @Patch(':id')
  @UseGuards(WishAuthorGuard)
  update(@Param('id') id: string,
    @Body() updatedWish: UpdateWishDto) {
    return this.wishService.updateOne({
      where: { id: +id },
      relations: ['owner'],
    }, updatedWish);
  }

  @Post(":id/copy")
  copyWish(
    @AuthUser() user: User,
    @Param('id') id: string
  ) {
    try {
      return this.wishService.copyWish(id, user)
    } catch (error) {
      throw new Error('Ошибка в копировании подарка')
    }
  }

  @Delete(':id')
  @UseGuards(WishAuthorGuard)
  remove(@Param('id') id: string) {
    try {
      return this.wishService.removeOne(+id);
    } catch (error) {
      throw new Error('Ошибка в удалении подарка')
    }
  }

}
