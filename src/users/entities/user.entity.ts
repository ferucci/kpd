import { Exclude } from "class-transformer";
import { IsDate, IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsUrl, Length, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { Wish } from "src/wishes/entities/wishes.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { WishList } from "src/wishlist/entities/wishlist.entity";

import { LENGTH_OF_COLUMNS, DEFAULT_VALUE } from "src/vars";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDate()
  @IsEmpty()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @IsEmpty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @Length(
    LENGTH_OF_COLUMNS.minUserNameLength,
    LENGTH_OF_COLUMNS.maxUserNameLength
  )
  @IsNotEmpty()
  username: string;

  @Column({ default: DEFAULT_VALUE.about })
  @Length(
    LENGTH_OF_COLUMNS.minUserAboutLength,
    LENGTH_OF_COLUMNS.maxUserAboutLength
  )
  @IsOptional()
  about: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @MinLength(LENGTH_OF_COLUMNS.minPasswordLength)
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Column({ default: DEFAULT_VALUE.avatar })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmpty()
  @OneToMany(() => Wish, (wishes) => wishes.owner)
  wishes: Wish[];

  // Содержит список подарков, на которые скинулся пользователь
  @IsEmpty()
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]

  // список вишлистов, которые создал пользователь
  @IsEmpty()
  @OneToMany(() => WishList, (wishlist) => wishlist.owner)
  wishlist: WishList[]
}