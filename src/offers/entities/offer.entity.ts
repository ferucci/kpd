import { IsDateString, IsEmpty, IsNumber, IsString, Length, Min } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wishes.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Offer {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsDateString()
  createdAt: Date

  @Column()
  @IsDateString()
  updatedAt: Date

  // сумма заявки, округляется до двух знаков после запятой;
  @Column()
  @IsNumber()
  amount: number

  // флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false.
  @Column({ default: false })
  hidden: boolean

  @IsEmpty()
  @ManyToOne(() => Wish, (wish) => wish.offers)
  // item содержит ссылку на товар;
  item: Wish

  // user содержит id желающего скинуться
  @ManyToOne(() => User, (user) => user.offers)
  user: User

}