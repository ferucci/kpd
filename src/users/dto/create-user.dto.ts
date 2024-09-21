import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import {
  DEFAULT_VALUE,
  EMAIL_REGULAR,
  LENGTH_OF_COLUMNS,
  MSG_ERROR,
  URL_REGULAR,
} from 'src/vars';

export class CreateUserDto {
  @IsEmail({}, { message: MSG_ERROR.inc_data })
  @IsNotEmpty()
  @Matches(EMAIL_REGULAR)
  email: string;

  @IsNotEmpty()
  @MinLength(LENGTH_OF_COLUMNS.minPasswordLength, {
    message: DEFAULT_VALUE.minLengthPass,
  })
  password: string;

  @IsNotEmpty()
  @Length(
    LENGTH_OF_COLUMNS.minUserNameLength,
    LENGTH_OF_COLUMNS.maxUserNameLength,
    { message: MSG_ERROR.inc_data },
  )
  username: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsString()
  @Matches(URL_REGULAR)
  @IsUrl()
  @IsOptional()
  avatar: string;
}
