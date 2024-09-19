import { IsDateString, IsEmpty, IsString, Length, MaxLength } from "class-validator";
import { UserPublicProfileResponseDto } from "src/users/dto/public-profile-response.dto";
import { User } from "src/users/entities/user.entity";
import { DEFAULT_VALUE, LENGTH_OF_COLUMNS } from "src/vars";
import { Wish } from "src/wishes/entities/wishes.entity";
import { WishPartial } from "src/wishes/entities/wishPartial.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  @IsString()
  @Length(
    LENGTH_OF_COLUMNS.minWishlistNameLength,
    LENGTH_OF_COLUMNS.maxWishlistNameLength
  )
  name: string

  @Column({ default: DEFAULT_VALUE.descWishlist })
  @IsString()
  @MaxLength(
    LENGTH_OF_COLUMNS.maxWishlistDescLength
  )
  description: string

  @Column()
  @IsString()
  image: string

  @IsEmpty()
  @ManyToOne(() => User, (user) => user.wishlist)
  owner: UserPublicProfileResponseDto

  // содержит набор ссылок на подарки.
  @IsEmpty()
  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  items: Wish[]
}