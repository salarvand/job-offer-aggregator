import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { JobOffersService } from './job-offers.service';
import { ExternalApisService } from './external-apis.service';
import { JobOffer } from '../../entities/job-offer.entity';
import { Api1JobOffer, Api2JobOffer } from '../../interfaces/external-api.interface';

@Injectable()
export class JobOffersSchedulerService {
  private readonly logger = new Logger(JobOffersSchedulerService.name);

  constructor(
    private readonly jobOffersService: JobOffersService,
    private readonly externalApisService: ExternalApisService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(process.env.CRON_SCHEDULE || '* * * * *')
  async fetchJobOffers() {
    this.logger.log('Starting job offers fetch...');

    try {
      const [api1Results, api2Results] = await Promise.all([
        this.fetchAndTransformApi1Offers(),
        this.fetchAndTransformApi2Offers(),
      ]);

      this.logger.log(`Job offers fetch completed. API1: ${api1Results} offers, API2: ${api2Results} offers`);
    } catch (error) {
      this.logger.error('Error fetching job offers:', error);
    }
  }

  private async fetchAndTransformApi1Offers(): Promise<number> {
    try {
      const api1Offers = await this.externalApisService.fetchFromApi1();
      this.logger.log(`Fetched ${api1Offers.length} offers from API1`);
      
      let savedCount = 0;
      for (const offer of api1Offers) {
        try {
          await this.saveTransformedApi1Offer(offer);
          savedCount++;
        } catch (error) {
          this.logger.error(`Error saving API1 offer ${offer.jobId}:`, error);
        }
      }
      return savedCount;
    } catch (error) {
      this.logger.error('Error processing API1 offers:', error);
      return 0;
    }
  }

  private async fetchAndTransformApi2Offers(): Promise<number> {
    try {
      const api2Offers = await this.externalApisService.fetchFromApi2();
      this.logger.log(`Fetched ${api2Offers.length} offers from API2`);
      
      let savedCount = 0;
      for (const offer of api2Offers) {
        try {
          await this.saveTransformedApi2Offer(offer);
          savedCount++;
        } catch (error) {
          this.logger.error(`Error saving API2 offer ${offer.jobId}:`, error);
        }
      }
      return savedCount;
    } catch (error) {
      this.logger.error('Error processing API2 offers:', error);
      return 0;
    }
  }

  private async saveTransformedApi1Offer(offer: Api1JobOffer) {
    if (!offer || !offer.jobId) {
      this.logger.warn('Invalid API1 offer received:', offer);
      return;
    }

    // Extract salary range numbers from string (e.g., "$69k - $103k")
    const salaryMatch = offer.details.salaryRange.match(/\$(\d+)k\s*-\s*\$(\d+)k/);
    const minSalary = salaryMatch ? parseInt(salaryMatch[1]) * 1000 : undefined;
    const maxSalary = salaryMatch ? parseInt(salaryMatch[2]) * 1000 : undefined;

    const transformedOffer: Partial<JobOffer> = {
      title: offer.title,
      company: offer.company.name,
      description: `${offer.details.type} position. Required skills: ${offer.skills.join(', ')}`,
      location: offer.details.location,
      minSalary,
      maxSalary,
      sourceApi: 'API1',
      externalId: `API1_${offer.jobId}`,
    };

    await this.saveOffer(transformedOffer);
  }

  private async saveTransformedApi2Offer(offer: Api2JobOffer & { jobId: string }) {
    if (!offer || !offer.jobId) {
      this.logger.warn('Invalid API2 offer received:', offer);
      return;
    }

    const transformedOffer: Partial<JobOffer> = {
      title: offer.position,
      company: offer.employer.companyName,
      description: `Experience: ${offer.requirements.experience} years. Technologies: ${offer.requirements.technologies.join(', ')}`,
      location: `${offer.location.city}, ${offer.location.state}${offer.location.remote ? ' (Remote)' : ''}`,
      minSalary: offer.compensation.min,
      maxSalary: offer.compensation.max,
      sourceApi: 'API2',
      externalId: `API2_${offer.jobId}`,
    };

    await this.saveOffer(transformedOffer);
  }

  private async saveOffer(offer: Partial<JobOffer>) {
    try {
      if (!offer.externalId) {
        this.logger.error('Offer is missing externalId');
        return;
      }

      const existingOffer = await this.jobOffersService.findByExternalId(offer.externalId);
      
      if (!existingOffer) {
        await this.jobOffersService.create(offer);
        this.logger.debug(`Saved new offer: ${offer.title} (${offer.externalId})`);
      }
    } catch (error) {
      this.logger.error(`Error saving offer ${offer.externalId}:`, error);
    }
  }
} 