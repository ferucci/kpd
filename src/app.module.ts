import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';

import { BDConfigFactory } from './config/db-config.factory';
import { AuthModule } from './auth/auth.module';
import { WishModule } from './wishes/wishes.module';
import { OfferModule } from './offer/offer.module';
import { WishlistModule } from './wishlist/wishlist.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: BDConfigFactory,
    }),
    AuthModule,
    UserModule,
    WishModule,
    WishlistModule,
    OfferModule,
  ],
})
export class AppModule { }
