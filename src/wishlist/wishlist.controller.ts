import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuardJWT } from 'src/auth/guards';
import { WishList } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { EntityNotFoundFilter } from 'src/common/exceptions';
import { MSG_ERROR } from 'src/vars';

@Controller('wishlistlists')
@UseGuards(AuthGuardJWT)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async findAll(@AuthUser() user: User): Promise<WishList[]> {
    try {
      return await this.wishlistService.find({
        where: { owner: { id: user.id } },
        relations: ['owner', 'items'],
      });
    } catch (_) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  @UseFilters(EntityNotFoundFilter)
  @Get(':id')
  async findOwn(@Param('id') id: string) {
    try {
      const wishlist = await this.wishlistService.findOne({
        where: { id: +id },
        relations: ['owner', 'items'],
      });
      return wishlist;
    } catch (_) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ): Promise<WishList> {
    try {
      return await this.wishlistService.create(createWishlistDto, user);
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.ecreate);
    }
  }

  @UseFilters(EntityNotFoundFilter)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatedWish: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    try {
      return this.wishlistService.updateOne(
        {
          where: { id: +id },
          relations: ['owner'],
        },
        updatedWish,
        user.id,
      );
    } catch (error) {
      throw new HttpException(MSG_ERROR.eupdate, HttpStatus.BAD_REQUEST);
    }
  }

  @UseFilters(EntityNotFoundFilter)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    try {
      return this.wishlistService.removeOne({ id: +id }, user.id);
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.edel);
    }
  }
}
