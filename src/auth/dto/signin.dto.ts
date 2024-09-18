
import { IsNotEmpty, Length, IsString } from "class-validator";

export class SignInDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}