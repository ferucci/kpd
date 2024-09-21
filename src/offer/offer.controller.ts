import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  BadRequestException,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuardJWT } from 'src/auth/guards';
import { EntityNotFoundFilter } from 'src/common/exceptions';
import { MSG_ERROR } from 'src/vars';
import { NoChangeGuard } from './guards/noChange.guard';

@Controller('offers')
@UseGuards(AuthGuardJWT)
export class OfferController {
  constructor(private readonly offerService: OfferService) { }

  @Post()
  async create(@AuthUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return await this.offerService.create(createOfferDto, user);
  }

  @Get()
  findAll() {
    try {
      return this.offerService.find({});
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eget);
    }
  }

  @UseFilters(EntityNotFoundFilter)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.offerService.findOne({
        where: { id: +id },
      });
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eget);
    }
  }

  @UseFilters(EntityNotFoundFilter)
  @Patch(':id')
  @UseGuards(NoChangeGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @AuthUser() user: User
  ) {
    try {
      return this.offerService.updateOne(
        { where: { id: +id } },
        updateOfferDto,
      );
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.eupdate);
    }
  }

  @UseFilters(EntityNotFoundFilter)
  @Delete(':id')
  @UseGuards(NoChangeGuard)
  remove(@Param('id') id: string) {
    try {
      return this.offerService.removeOne({ id: +id });
    } catch (_) {
      throw new BadRequestException(MSG_ERROR.edel);
    }
  }
}
