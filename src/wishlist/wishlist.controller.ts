import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuardJWT } from 'src/auth/guards';
import { WishList } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
@UseGuards(AuthGuardJWT)
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
  ) { }

  @Get()
  async findAll(
    @AuthUser() user: User
  ): Promise<WishList[]> {
    return await this.wishlistService.find({
      where: { owner: { id: user.id } }, relations: ['owner', 'items']
    });
  }

  @Get(':id')
  async findOwn(
    @Param('id') id: string
  ) {
    const wishlist = await this.wishlistService.findOne({
      where: { id: +id }, relations: ['owner', 'items']
    })
    console.log('get wishlist', wishlist)
    return wishlist
  }

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User
  ): Promise<WishList> {
    try {
      return await this.wishlistService.create(createWishlistDto, user);
    } catch (error) {
      console.log(error)
      throw new Error('Ошибка в создании wishlist-a')
    }
  }

  @Patch(':id')
  update(@Param('id') id: string,
    @Body() updatedWish: UpdateWishlistDto,
    @AuthUser() user: User
  ) {
    return this.wishlistService.updateOne({
      where: { id: +id },
      relations: ['owner'],
    }, updatedWish, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    try {
      return this.wishlistService.removeOne({ id: +id }, user.id);
    } catch (error) {
      throw new BadRequestException('Ошибка в удалении вишлиста')
    }
  }
}
