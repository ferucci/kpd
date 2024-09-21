import {
  IsDateString,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { LENGTH_OF_COLUMNS } from 'src/vars';

export class UserPublicProfileResponseDto {
  @IsNumber()
  id: number;

  @Length(
    LENGTH_OF_COLUMNS.minUserNameLength,
    LENGTH_OF_COLUMNS.maxUserNameLength,
  )
  username: string;

  @IsString()
  about: string;

  @IsString()
  @IsUrl()
  avatar: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
