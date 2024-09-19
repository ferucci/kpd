import { Injectable } from '@nestjs/common';
import { DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { WishList } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UserService } from 'src/users/user.service';
import { WishService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wishes.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepo: Repository<WishList>,
    @InjectRepository(Wish)
    private readonly wishRepo: Repository<Wish>,
    private readonly userService: UserService
  ) { }

  async findOne(query: FindOneOptions<WishList>): Promise<WishList> {
    const wishlist = await this.wishlistsRepo.findOne(query);
    console.log(wishlist)
    return wishlist
  }

  async find(query: FindManyOptions<WishList>): Promise<WishList[]> {
    const wishlist = await this.wishlistsRepo.find(query);
    return wishlist
  }

  async create(createWishlistDto: CreateWishlistDto, userId: number) {

    const owner = await this.userService.findOne(
      { where: { id: userId } }
    );

    const wishlist = this.wishlistsRepo.create({
      ...createWishlistDto, owner
    })
    const wishes = await this.wishRepo.find({
      where: { owner: { id: userId } }
    });
    wishlist.items = wishes;

    return this.wishlistsRepo.save(wishlist);

  }

  //   async getWishlist(id: number): Promise<WishList> {
  //     return this.wishlistsRepo.findOne(id, { relations: ['items'] });
  // }

  async removeOne(query: Partial<WishList>): Promise<DeleteResult> {
    return await this.wishlistsRepo.delete(query)
  }
}
