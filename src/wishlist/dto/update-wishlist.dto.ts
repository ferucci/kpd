import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
// Делает все поля CreateUserDto не обязательными
export class UpdateWishlistDto extends PartialType(CreateWishlistDto) { }