import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';
import { WishList } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UserPublicProfileResponseDto } from 'src/users/dto/public-profile-response.dto';
import { WishService } from 'src/wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ChekingEndingEntity, editForbidden, MSG_ERROR } from 'src/vars';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepo: Repository<WishList>,
    private readonly wishService: WishService,
  ) {}

  async findOne(query: FindOneOptions<WishList>): Promise<WishList> {
    try {
      return await this.wishlistsRepo.findOne(query);
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  async find(query: FindManyOptions<WishList>): Promise<WishList[]> {
    try {
      return await this.wishlistsRepo.find(query);
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    user: UserPublicProfileResponseDto,
  ): Promise<WishList> {
    const { itemsId: items } = createWishlistDto;

    const wishes = await this.wishService.find({
      where: { id: In(items) },
    });

    if (!wishes.length) {
      throw new NotFoundException(MSG_ERROR.eget);
    }

    const wishlist = this.wishlistsRepo.create({
      ...createWishlistDto,
      owner: user,
      items: [...wishes],
    });

    try {
      return await this.wishlistsRepo.save(wishlist);
    } catch (error) {
      throw new Error(MSG_ERROR.ecreate);
    }
  }

  async updateOne(
    query: FindOneOptions<WishList>,
    body: UpdateWishlistDto,
    userId: number,
  ): Promise<WishList> {
    const entity = await this.findOne(query);
    if (entity.owner.id !== userId)
      throw new ForbiddenException(editForbidden(ChekingEndingEntity.wishlist));
    return this.wishlistsRepo.save({ ...entity, ...body });
  }

  async removeOne(
    query: Partial<WishList>,
    userId: number,
  ): Promise<DeleteResult> {
    const { id } = query;
    const wish = await this.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (wish.owner.id !== userId)
      throw new ForbiddenException(editForbidden(ChekingEndingEntity.wishlist));
    return await this.wishlistsRepo.delete(query);
  }
}
