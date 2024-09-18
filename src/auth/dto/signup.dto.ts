import { IsEmail, IsString, Matches } from "class-validator";
import { SignInDto } from "./signin.dto";

export class SignUpDto extends SignInDto {
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  email: string;
}