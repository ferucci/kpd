import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches, MinLength } from "class-validator";
import { EMAIL_REGULAR, LENGTH_OF_COLUMNS, URL_REGULAR } from "src/vars";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(EMAIL_REGULAR)
  email: string;

  @IsNotEmpty()
  @MinLength(
    LENGTH_OF_COLUMNS.minPasswordLength
  )
  password: string;

  @IsNotEmpty()
  @Length(
    LENGTH_OF_COLUMNS.minUserNameLength,
    LENGTH_OF_COLUMNS.maxUserNameLength
  )
  username: string;

  @IsString()
  @IsOptional()
  about: string

  @IsString()
  @Matches(URL_REGULAR)
  @IsUrl()
  @IsOptional()
  avatar: string

}
