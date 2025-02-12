import { Controller, Get, Query, ValidationPipe, Post } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTooManyRequestsResponse
} from '@nestjs/swagger';
import { JobOffersService } from './job-offers.service';
import { JobOffersSchedulerService } from './job-offers-scheduler.service';
import { FilterJobOffersDto } from '../../dto/filter-job-offers.dto';
import { 
  PaginatedJobOffersResponse, 
  FetchJobOffersResponse, 
  CreateTestDataResponse 
} from '../../interfaces/api-response.interface';
import { JobOffer } from '../../entities/job-offer.entity';

@ApiTags('Job Offers')
@Controller('api/job-offers')
export class JobOffersController {
  constructor(
    private readonly jobOffersService: JobOffersService,
    private readonly schedulerService: JobOffersSchedulerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all job offers',
    description: 'Retrieve a paginated list of job offers with optional filters. Rate limited to 10 requests per minute.'
  })
  @ApiQuery({ type: FilterJobOffersDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved job offers',
    type: PaginatedJobOffersResponse
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameters provided'
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests, please try again later'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred'
  })
  async findAll(
    @Query(new ValidationPipe({ 
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    })) filterDto: FilterJobOffersDto,
  ): Promise<PaginatedJobOffersResponse> {
    return this.jobOffersService.findAll(filterDto);
  }

  @Post('fetch')
  @ApiOperation({
    summary: 'Fetch job offers',
    description: 'Manually trigger job offers fetch from external APIs'
  })
  @ApiResponse({
    status: 200,
    description: 'Job offers fetch triggered successfully',
    type: FetchJobOffersResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error occurred while fetching job offers'
  })
  async triggerFetch(): Promise<FetchJobOffersResponse> {
    await this.schedulerService.fetchJobOffers();
    return { message: 'Job offers fetch completed' };
  }

  @Post('test-data')
  @ApiOperation({
    summary: 'Create test data',
    description: 'Create sample job offers for testing purposes'
  })
  @ApiResponse({
    status: 200,
    description: 'Test data created successfully',
    type: CreateTestDataResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error occurred while creating test data'
  })
  async createTestData(): Promise<CreateTestDataResponse> {
    await this.jobOffersService.createTestData();
    return { message: 'Test data created successfully' };
  }
} 