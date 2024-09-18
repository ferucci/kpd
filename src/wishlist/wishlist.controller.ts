import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuardJWT } from 'src/auth/guards';

@Controller('wishlistlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Get()
  async findAll() {
    const wishlist = await this.wishlistService.find({});
    console.log('my wishlists : ', wishlist)
    return wishlist;
  }

  @Get(':id')
  findOwn(
    @Param('id') id: string
  ) {
    return this.wishlistService.findOne({
      where: { id: +id }
    })
  }

  @UseGuards(AuthGuardJWT)
  @Post()
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


}
