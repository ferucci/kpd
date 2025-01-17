import { IsEmpty, IsString, Length, Min } from 'class-validator';
import { Offer } from 'src/offer/entities/offer.entity';
import { UserPublicProfileResponseDto } from 'src/users/dto/public-profile-response.dto';
import { User } from 'src/users/entities/user.entity';
import { LENGTH_OF_COLUMNS } from 'src/vars';
import { WishList } from 'src/wishlist/entities/wishlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(
    LENGTH_OF_COLUMNS.minWishNameLength,
    LENGTH_OF_COLUMNS.maxWishNameLength,
  )
  name: string;

  @IsString()
  @Column()
  link: string;

  @IsString()
  @Column()
  image: string;

  @Length(
    LENGTH_OF_COLUMNS.minWishDescLength,
    LENGTH_OF_COLUMNS.maxWishDescLength,
  )
  @Column()
  description: string;

  @Column()
  @Min(LENGTH_OF_COLUMNS.minWishNumLength)
  price: number;

  @IsEmpty()
  @ManyToOne(() => User, (user) => user.wishes, {
    cascade: ['remove', 'update'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: UserPublicProfileResponseDto;

  @IsEmpty()
  @OneToMany(() => Offer, (offer) => offer.item)
  // массив ссылок на заявки скинуться от других пользователей
  offers: Offer[];

  @IsEmpty()
  @ManyToMany(() => WishList, (wishlist) => wishlist.items)
  wishlists: WishList[];

  @Column({
    default: 0,
  })
  @Min(LENGTH_OF_COLUMNS.minWishNumLength)
  // сумма, которую пользователи сейчас готовы скинуть на подарок - Округлить до сотых
  raised: number;

  @Column({
    default: LENGTH_OF_COLUMNS.minWishCopiedLength,
  })
  // cчётчик тех, кто скопировал подарок себе. Целое десятичное число.
  copied: number;
}
