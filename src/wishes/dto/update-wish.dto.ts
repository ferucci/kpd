import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
// Делает все поля CreateWishDto не обязательными
export class UpdateWishDto extends PartialType(CreateWishDto) {}
