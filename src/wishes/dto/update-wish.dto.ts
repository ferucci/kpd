import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wishes.dto';
// Делает все поля CreateUserDto не обязательными
export class UpdateWishDto extends PartialType(CreateWishDto) { }