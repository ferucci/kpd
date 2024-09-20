import { IsNotEmpty, IsString } from "class-validator"
import { Wish } from "src/wishes/entities/wishes.entity"


export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  image: string

  @IsNotEmpty()
  itemsId?: number[]
}