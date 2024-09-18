import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WishList } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UserService } from 'src/users/user.service';
import { WishService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepo: Repository<WishList>,
    private readonly userService: UserService,
    // private readonly wishesService: WishService
  ) { }

  async findAll(): Promise<WishList[]> {
    const wishlists = await this.wishlistsRepo.find();
    console.log(wishlists)
    return wishlists;
  }

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const owner = await this.userService.findOne(
      { where: { id: userId } }
    );

    const wishlist = this.wishlistsRepo.create({
      ...createWishlistDto, owner
    })

    return this.wishlistsRepo.save(wishlist);

  }
}
