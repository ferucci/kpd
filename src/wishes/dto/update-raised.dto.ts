import { IsNumber, Min } from 'class-validator';

export class UpdateWishRaisedDto {
  @IsNumber()
  @Min(1)
  raised?: number;
}
