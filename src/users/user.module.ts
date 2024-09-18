import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WishModule } from 'src/wishes/wishes.module';
import { Wish } from 'src/wishes/entities/wishes.entity';
import { WishlistModule } from 'src/wishlist/wishlist.module';
// import { AuthModule } from 'src/auth/auth.module';

@Module({
  // Указываю что конкретно в этом модуле, будет возможность обращаться к таблице User ( т.е. импорт этого модуля даёт возможность заинжектить в сервис)
  imports: [
    TypeOrmModule.forFeature([User, Wish]),
    forwardRef(() => WishModule),
    forwardRef(() => WishlistModule),
    // forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
