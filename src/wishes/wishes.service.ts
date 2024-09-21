import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ChekingEndingEntity, editForbidden, MSG_ERROR } from 'src/vars';
import { UpdateWishRaisedDto } from './dto/update-raised.dto';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UserService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const owner = await this.userService.findOne({ where: { id: userId } });
    const wish = this.wishRepository.create({ ...createWishDto, owner });
    return await this.wishRepository.save(wish);
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    try {
      return await this.wishRepository.findOne(query);
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  async find(query: FindManyOptions<Wish>): Promise<Wish[]> {
    try {
      return await this.wishRepository.find(query);
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  async updateWishRaised(
    query: FindManyOptions<Wish>,
    body: UpdateWishRaisedDto,
  ): Promise<Wish> {
    const { raised } = body;
    const wish = await this.findOne(query);
    if (!wish) throw new NotFoundException(MSG_ERROR.cntf);

    return this.wishRepository.save({ ...wish, raised });
  }

  async updateOne(
    query: FindOneOptions<Wish>,
    body: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findOne(query);

    if (wish.price > 0 && body.price > 0)
      throw new BadRequestException({
        message: MSG_ERROR.editPrice,
      });

    if (wish.owner.id !== userId) {
      throw new ForbiddenException({
        message: editForbidden(ChekingEndingEntity.wish),
        user: userId,
        owner: wish.owner.id,
      });
    }

    return this.wishRepository.save({ ...wish, ...body });
  }

  async removeOne(query: Partial<Wish>, userId: number): Promise<DeleteResult> {
    const { id } = query;
    const wish = await this.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) throw new HttpException(MSG_ERROR.cntf, HttpStatus.NOT_FOUND);
    if (wish.owner.id !== userId)
      throw new ForbiddenException(editForbidden(ChekingEndingEntity.wish));
    return await this.wishRepository.delete(query);
  }

  async copyWish(query: FindOneOptions<Wish>, user: User) {
    const wish = await this.findOne(query);

    if (!wish) {
      throw new NotFoundException(MSG_ERROR.cntf);
    }

    const exist = await this.findOne({
      where: {
        owner: { id: user.id },
      },
      relations: ['owner'],
    });

    if (exist)
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: MSG_ERROR.rewriteWish,
      });

    const newWish = this.wishRepository.create({
      ...wish,
      owner: user,
      copied: 0,
      raised: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
      id: undefined,
    });

    wish.copied += 1;
    await this.wishRepository.save(wish);
    await this.wishRepository.save(newWish);
    return {};
  }
}
