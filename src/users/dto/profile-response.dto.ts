import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, IsUrl, Length, Matches } from "class-validator";
import { EMAIL_REGULAR, LENGTH_OF_COLUMNS } from "src/vars";

export class UserProfileResponseDto {
  @IsNumber()
  id: number

  @Length(
    LENGTH_OF_COLUMNS.minUserNameLength,
    LENGTH_OF_COLUMNS.maxUserNameLength
  )
  username: string;

  @IsEmail()
  @Matches(EMAIL_REGULAR)
  email: string;

  @IsString()
  about: string

  @IsString()
  @IsUrl()
  avatar: string

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date

}