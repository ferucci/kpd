import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuardJWT } from 'src/auth/guards';

@Controller('wishlistlists')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
  ) { }

  @Get()
  @UseGuards(AuthGuardJWT)
  async findAll(
    @AuthUser() user: User
  ) {

    const wishlist = await this.wishlistService.find({
      where: { owner: { id: user.id } }, relations: ['owner']
    });
    return wishlist;
  }

  @Get(':id')
  findOwn(
    @Param('id') id: string
  ) {
    return this.wishlistService.findOne({
      where: { id: +id }, relations: ['owner', 'items']
    })
  }

  @Post()
  @UseGuards(AuthGuardJWT)
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User
  ) {
    try {
      return this.wishlistService.create(createWishlistDto, user.id);
    } catch (error) {
      throw new Error('Ошибка в создании wishlist-a')
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.wishlistService.removeOne({ id: +id });
  }
}
