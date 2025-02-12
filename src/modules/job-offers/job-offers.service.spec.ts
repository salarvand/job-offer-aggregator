import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffersService } from './job-offers.service';
import { JobOffer } from '../../entities/job-offer.entity';

describe('JobOffersService', () => {
  let service: JobOffersService;
  let repository: Repository<JobOffer>;

  const mockJobOffer: JobOffer = {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Corp',
    description: 'Job description',
    location: 'New York',
    minSalary: 80000,
    maxSalary: 120000,
    sourceApi: 'API1',
    externalId: 'API1_123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const queryBuilderMock = {
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockJobOffer], 1]),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOffersService,
        {
          provide: getRepositoryToken(JobOffer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<JobOffersService>(JobOffersService);
    repository = module.get<Repository<JobOffer>>(getRepositoryToken(JobOffer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated job offers', async () => {
      const filterDto = { page: 1, limit: 10 };
      const result = await service.findAll(filterDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('jobOffer');
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('jobOffer.createdAt', 'DESC');
      expect(result).toEqual({
        items: [mockJobOffer],
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it('should apply filters when provided', async () => {
      const filterDto = {
        title: 'Engineer',
        location: 'New York',
        minSalary: 70000,
        maxSalary: 150000,
        page: 1,
        limit: 10,
      };

      await service.findAll(filterDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('jobOffer');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'jobOffer.title ILIKE :title',
        { title: '%Engineer%' }
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'jobOffer.location ILIKE :location',
        { location: '%New York%' }
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'jobOffer.minSalary >= :minSalary',
        { minSalary: 70000 }
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'jobOffer.maxSalary <= :maxSalary',
        { maxSalary: 150000 }
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(4);
    });
  });

  describe('create', () => {
    it('should create a new job offer', async () => {
      mockRepository.create.mockReturnValue(mockJobOffer);
      mockRepository.save.mockResolvedValue(mockJobOffer);

      const result = await service.create(mockJobOffer);

      expect(mockRepository.create).toHaveBeenCalledWith(mockJobOffer);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockJobOffer);
    });
  });

  describe('findByExternalId', () => {
    it('should find a job offer by external ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockJobOffer);

      const result = await service.findByExternalId('API1_123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'API1_123' },
      });
      expect(result).toEqual(mockJobOffer);
    });

    it('should return null when job offer is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByExternalId('nonexistent');

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('createTestData', () => {
    it('should create test data if not exists', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto as JobOffer);
      mockRepository.save.mockImplementation((entity) => Promise.resolve(entity));

      await service.createTestData();

      expect(mockRepository.findOne).toHaveBeenCalledTimes(3); // 3 test offers
      expect(mockRepository.create).toHaveBeenCalledTimes(3);
      expect(mockRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should not create duplicate test data', async () => {
      mockRepository.findOne.mockResolvedValue(mockJobOffer);

      await service.createTestData();

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
}); 