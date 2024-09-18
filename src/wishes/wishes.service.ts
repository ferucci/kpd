import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wishes.dto';
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
    return await this.wishRepository.find(query);
  }

  async updateOne(query: FindOneOptions<Wish>, body: UpdateWishDto, userId: number): Promise<Wish> {
    try {
      const entity = await this.findOne(query);
      if (entity.owner.id !== userId) throw new ForbiddenException('Редактирование чужих подарков запрещено');
      return this.wishRepository.save({ ...entity, ...body })
    } catch (error) {
      throw new HttpException("Ошибка при обновлении", HttpStatus.BAD_REQUEST);
    }
  }

  async removeOne(query: Partial<Wish>, userId: number): Promise<DeleteResult> {
    const { id } = query;
    const wish = await this.findOne({
      where: { id }, relations: ['owner']
    })
    if (wish.owner.id !== userId) throw new ForbiddenException('Удаление чужих подарков запрещено');
    return await this.wishRepository.delete(query);
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
