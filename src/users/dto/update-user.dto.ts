import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
// Делает все поля CreateUserDto не обязательными
export class UpdateUserDto extends PartialType(CreateUserDto) {}
