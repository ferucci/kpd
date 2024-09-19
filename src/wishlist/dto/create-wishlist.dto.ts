import { IsArray, IsNotEmpty, IsString } from "class-validator"
import { Wish } from "src/wishes/entities/wishes.entity"
import { WishPartial } from "src/wishes/entities/wishPartial.entity"


export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  image: string

  items: Wish[]
}