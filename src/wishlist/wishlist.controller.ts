import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuardJWT } from 'src/auth/guards';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Get()
  findAll() {
    const wishlist = this.wishlistService.findAll();
    console.log('my wishlist : ', wishlist)
    return wishlist;
  }

  @Get(':id')
  findOwn() { console.log('test') }

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
