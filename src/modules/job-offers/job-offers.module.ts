import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from '../../entities/job-offer.entity';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';
import { ExternalApisService } from './external-apis.service';
import { JobOffersSchedulerService } from './job-offers-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer])],
  controllers: [JobOffersController],
  providers: [
    JobOffersService,
    ExternalApisService,
    JobOffersSchedulerService,
  ],
  exports: [JobOffersService],
})
export class JobOffersModule {} 