import { IsDateString, IsNumber, IsString, Length, Min } from "class-validator";
import { LENGTH_OF_COLUMNS } from "src/vars";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WishPartial {
  @PrimaryGeneratedColumn()
  id: number

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date

  @Column()
  @IsString()
  @Length(
    LENGTH_OF_COLUMNS.minWishNameLength,
    LENGTH_OF_COLUMNS.maxWishNameLength
  )
  name: string

  @Column()
  @IsString()
  link: string

  @Column()
  @IsString()
  image: string

  @Column()
  @IsNumber()
  @Min(LENGTH_OF_COLUMNS.minWishNumLength)
  price: number

  @Column()
  @IsNumber()
  @Min(LENGTH_OF_COLUMNS.minWishNumLength)
  raised: number

  @Column()
  @IsNumber()
  copied: number

  @Column()
  @IsString()
  @Length(
    LENGTH_OF_COLUMNS.minWishDescLength,
    LENGTH_OF_COLUMNS.maxWishDescLength
  )
  description: string

}