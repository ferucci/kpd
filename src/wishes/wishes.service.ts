import { Injectable, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wishes.dto';
import { IWishPaginator } from 'src/interfaces';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UserService
  ) { }

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const owner = await this.userService.findOne(
      { where: { id: userId } }
    );
    const wish = this.wishRepository.create({ ...createWishDto, owner });
    return this.wishRepository.save(wish);
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return await this.wishRepository.findOne(query);
  }

  async find(query: FindManyOptions<Wish>): Promise<Wish[]> {
    console.log("find query: ", query)
    return await this.wishRepository.find(query);
  }

  // { where: { id: parseInt(id, 10) } }

  async updateOne(query: FindOneOptions<Wish>, body: UpdateWishDto): Promise<Wish> {
    console.log(body)
    const entity = await this.findOne(query);
    return this.wishRepository.save({ ...entity, ...body })
  }

  async removeOne(id: number): Promise<DeleteResult> {
    return await this.wishRepository.delete(id);
  }

  async copyWish(id: string, user: User) {
    const wish = await this.findOne(
      { where: { id: +id } }
    )
    if (!wish) {
      throw new NotFoundException("Данная карточка отсутствует")
    }

    const newWish = this.wishRepository.create({
      ...wish,
      owner: user,
      copied: 0,
      raised: 0,
      updatedAt: new Date,
      createdAt: new Date,
      id: undefined
    });

    return await this.wishRepository.save(newWish);
  }
}
