import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';

import { BDConfigFactory } from './config/db-config.factory';
import { AuthModule } from './auth/auth.module';
import { WishModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { WishlistModule } from './wishlist/wishlist.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      useClass: BDConfigFactory
    }),
    UserModule,
    AuthModule,
    WishModule,
    OffersModule,
    WishlistModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
