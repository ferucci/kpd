import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { WishService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuardJWT } from 'src/auth/guards';
import { Wish } from './entities/wishes.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { MSG_ERROR, VARS } from 'src/vars';
import { EntityNotFoundFilter } from 'src/common/exceptions';

@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @UseGuards(AuthGuardJWT)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user: User) {
    try {
      return this.wishService.create(createWishDto, user.id);
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.ecreate);
    }
  }

  @Get('last')
  async findLasts(): Promise<Wish[]> {
    try {
      const limit = VARS.LIMIT_LAST_WISHES;
      return this.wishService.find({
        order: { createdAt: 'DESC' },
        take: limit,
        relations: {
          owner: true,
          offers: {
            user: {
              wishes: true,
              wishlist: { owner: true, items: true },
              offers: true,
            },
          },
        },
      });
    } catch (_) {
      throw new BadRequestException({
        message: MSG_ERROR.eget,
      });
    }
  }

  @Get('top')
  async findTops(): Promise<Wish[]> {
    try {
      return this.wishService.find({
        order: { copied: 'DESC' },
        take: VARS.LIMIT_TOP_WISHES,
        relations: {
          owner: true,
          offers: {
            user: {
              wishes: true,
              wishlist: { owner: true, items: true },
              offers: true,
            },
          },
        },
      });
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eget);
    }
  }

  @UseGuards(AuthGuardJWT)
  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOneById(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<Wish> {
    try {
      const foundWish = await this.wishService.findOne({
        where: { id: +id },
        relations: {
          offers: {
            user: {
              wishes: { owner: true, offers: true /*string*/ },
              wishlist: { owner: true, items: true },
              offers: true,
            },
            item: {
              owner: true,
              offers: true /*string*/,
            },
          },
          owner: true,
        },
      });
      return foundWish;
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eget);
    }
  }

  @UseGuards(AuthGuardJWT)
  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  update(
    @Param('id') id: string,
    @Body() updatedWish: UpdateWishDto,
    @AuthUser() user: User,
  ) {
    return this.wishService.updateOne(
      {
        where: { id: +id },
        relations: ['owner'],
      },
      updatedWish,
      user.id,
    );
  }

  @UseGuards(AuthGuardJWT)
  @Post(':id/copy')
  @UseFilters(EntityNotFoundFilter)
  copyWish(@AuthUser() user: User, @Param('id') id: string) {
    try {
      return this.wishService.copyWish({ where: { id: +id } }, user);
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.ecopy);
    }
  }

  @UseGuards(AuthGuardJWT)
  @Delete(':id')
  @UseFilters(EntityNotFoundFilter)
  remove(@Param('id') id: string, @AuthUser() user: User) {
    try {
      return this.wishService.removeOne({ id: +id }, user.id);
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.edel);
    }
  }
}
