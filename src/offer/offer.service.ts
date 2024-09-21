import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { WishService } from 'src/wishes/wishes.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { MSG_ERROR } from 'src/vars';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class OfferService {
  constructor(
    private readonly wishService: WishService,
    private readonly userRepa: UserService,
    @InjectRepository(Offer)
    private readonly offerRepa: Repository<Offer>,
  ) { }
  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { itemId, amount } = createOfferDto;
    const query = {
      where: { item: { id: itemId } },
      relations: {
        item: true,
        user: { wishes: true, offers: true },
      },
    };

    const existsOffer = await this.findOne(query);

    const owner = await this.userRepa.findOne({
      where: { id: user.id },
      relations: ['offers', 'wishes', 'wishlist'],
    });

    const wish = await this.wishService.findOne({
      where: { id: itemId },
      relations: {
        owner: true,
        offers: { item: true, user: true },
      },
    });

    const raised = wish.raised + amount;

    if (wish.owner.id === user.id)
      throw new ForbiddenException({
        message: MSG_ERROR.depositYourWish,
      });

    if (raised > wish.price) {
      throw new BadRequestException({
        message: MSG_ERROR.amountIsMore,
        amount: amount,
        price: wish.price,
      });
    }

    await this.wishService.updateWishRaised(
      { where: { id: itemId }, relations: ['owner'] },
      { raised },
    );

    if (existsOffer) return await this.updateOne(query, { amount: raised });

    return await this.offerRepa.save({
      ...createOfferDto,
      user: owner,
      amount,
      item: wish,
    });
  }

  async find(query: FindOneOptions<Offer>): Promise<Offer[]> {
    return await this.offerRepa.find(query);
  }

  async findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    return await this.offerRepa.findOne(query);
  }

  async updateOne(
    query: FindOneOptions<Offer>,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer> {
    const entity = await this.findOne(query);
    const offer = await this.offerRepa.save({ ...entity, ...updateOfferDto });
    return offer;
  }

  removeOne(query: Partial<Offer>) {
    return this.offerRepa.delete(query);
  }
}
