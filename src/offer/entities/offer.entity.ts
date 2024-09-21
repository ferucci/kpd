import { IsEmpty, IsNumber } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wishes.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  // сумма заявки, округляется до двух знаков после запятой;
  @Column()
  @IsNumber()
  amount: number;

  // флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false.
  @Column({ default: false })
  hidden: boolean;

  @IsEmpty()
  @ManyToOne(() => Wish, (wish) => wish.offers, {
    cascade: ['remove', 'update'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  // item содержит ссылку на товар;
  item: Wish;

  // user содержит id желающего скинуться
  @ManyToOne(() => User, (user) => user.offers, {
    cascade: ['remove', 'update'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
