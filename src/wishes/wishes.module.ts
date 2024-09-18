import { forwardRef, Module } from '@nestjs/common';
import { WishService } from './wishes.service';
import { WishController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), forwardRef(() => UserModule)],
  controllers: [WishController],
  providers: [WishService],
  exports: [WishService]
})
export class WishModule { }
