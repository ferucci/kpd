import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { WishList } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UserPublicProfileResponseDto } from 'src/users/dto/public-profile-response.dto';
import { WishService } from 'src/wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepo: Repository<WishList>,
    private readonly wishService: WishService,
  ) { }

  async findOne(query: FindOneOptions<WishList>): Promise<WishList> {
    return await this.wishlistsRepo.findOne(query);
  }

  async find(query: FindManyOptions<WishList>): Promise<WishList[]> {
    return await this.wishlistsRepo.find(query);
  }

  async create(createWishlistDto: CreateWishlistDto, user: UserPublicProfileResponseDto): Promise<WishList> {
    const { itemsId: items } = createWishlistDto;

    const wishes = await this.wishService.find({
      where: { id: In(items) }
    });

    if (!wishes.length) {
      throw new Error('No wishes found for the provided IDs');
    }

    const wishlist = this.wishlistsRepo.create({
      ...createWishlistDto,
      owner: user,
      items: [...wishes]
    });

    try {
      return await this.wishlistsRepo.save(wishlist);
    } catch (error) {
      throw new Error('Error saving wishlist: ' + error.message);
    }
  }

  async updateOne(query: FindOneOptions<WishList>, body: UpdateWishlistDto, userId: number): Promise<WishList> {
    try {
      const entity = await this.findOne(query);
      if (entity.owner.id !== userId) throw new ForbiddenException('Редактирование чужих вишлистов запрещено');
      return this.wishlistsRepo.save({ ...entity, ...body });
    } catch (error) {
      throw new HttpException("Ошибка при обновлении", HttpStatus.BAD_REQUEST);
    }
  }

  async removeOne(query: Partial<WishList>, userId: number): Promise<DeleteResult> {
    const { id } = query;
    const wish = await this.findOne({
      where: { id }, relations: ['owner']
    })
    if (wish.owner.id !== userId) throw new ForbiddenException('Удаление чужих вишлистов запрещено');
    return await this.wishlistsRepo.delete(query);
  }
}
