import { forwardRef, Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entities/wishlist.entity';
import { UserModule } from 'src/users/user.module';
import { WishModule } from 'src/wishes/wishes.module';
import { Wish } from 'src/wishes/entities/wishes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishList, Wish]),
    forwardRef(() => UserModule,),
    forwardRef(() => WishModule)
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService]
})
export class WishlistModule { }
