import { forwardRef, Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishModule } from 'src/wishes/wishes.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    forwardRef(() => WishModule),
    forwardRef(() => UserModule),
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
