import { IsJWT, IsString } from "class-validator";

export class SignInUserResponseDto {
  @IsString()
  @IsJWT()
  access_token: string
}