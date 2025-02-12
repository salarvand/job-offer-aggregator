import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from '../../entities/job-offer.entity';
import { FilterJobOffersDto } from '../../dto/filter-job-offers.dto';
import { PaginatedResponse } from '../../interfaces/pagination.interface';

@Injectable()
export class JobOffersService {
  constructor(
    @InjectRepository(JobOffer)
    private jobOffersRepository: Repository<JobOffer>,
  ) {}

  async findAll(filterDto: FilterJobOffersDto): Promise<PaginatedResponse<JobOffer>> {
    const { title, location, minSalary, maxSalary, page = 1, limit = 10 } = filterDto;
    
    const queryBuilder = this.jobOffersRepository.createQueryBuilder('jobOffer');

    if (title) {
      queryBuilder.andWhere('jobOffer.title ILIKE :title', { title: `%${title}%` });
    }

    if (location) {
      queryBuilder.andWhere('jobOffer.location ILIKE :location', { location: `%${location}%` });
    }

    if (minSalary) {
      queryBuilder.andWhere('jobOffer.minSalary >= :minSalary', { minSalary });
    }

    if (maxSalary) {
      queryBuilder.andWhere('jobOffer.maxSalary <= :maxSalary', { maxSalary });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    queryBuilder.orderBy('jobOffer.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(jobOffer: Partial<JobOffer>): Promise<JobOffer> {
    const newJobOffer = this.jobOffersRepository.create(jobOffer);
    return this.jobOffersRepository.save(newJobOffer);
  }

  async findByExternalId(externalId: string): Promise<JobOffer | null> {
    return this.jobOffersRepository.findOne({ where: { externalId } });
  }

  async createTestData() {
    const testOffers = [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        description: 'Looking for a senior software engineer with 5+ years of experience',
        location: 'New York, USA',
        minSalary: 120000,
        maxSalary: 180000,
        sourceApi: 'TEST',
        externalId: 'TEST_1',
      },
      {
        title: 'Frontend Developer',
        company: 'Web Solutions',
        description: 'Frontend developer position with React experience',
        location: 'San Francisco, USA',
        minSalary: 90000,
        maxSalary: 140000,
        sourceApi: 'TEST',
        externalId: 'TEST_2',
      },
      {
        title: 'DevOps Engineer',
        company: 'Cloud Services Inc',
        description: 'DevOps engineer with AWS and Kubernetes experience',
        location: 'Remote',
        minSalary: 100000,
        maxSalary: 160000,
        sourceApi: 'TEST',
        externalId: 'TEST_3',
      },
    ];

    for (const offer of testOffers) {
      const existing = await this.findByExternalId(offer.externalId);
      if (!existing) {
        await this.create(offer);
      }
    }
  }
} 