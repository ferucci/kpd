import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
// Делает все поля CreateUserDto не обязательными
export class UpdateWishDto extends PartialType(CreateOfferDto) { }