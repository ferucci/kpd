import { IsNumber, IsString, Length, Matches, Min } from 'class-validator';
import { LENGTH_OF_COLUMNS, URL_REGULAR } from 'src/vars';

export class CreateWishDto {
  @IsString()
  @Length(
    LENGTH_OF_COLUMNS.minWishNameLength,
    LENGTH_OF_COLUMNS.maxWishNameLength,
  )
  name: string;

  @IsString()
  link: string;

  @IsString()
  @Matches(URL_REGULAR)
  image: string;

  @IsString()
  @Length(
    LENGTH_OF_COLUMNS.minWishDescLength,
    LENGTH_OF_COLUMNS.maxWishDescLength,
  )
  description: string;

  @IsNumber()
  @Min(LENGTH_OF_COLUMNS.minWishNumLength)
  price: number;
}
