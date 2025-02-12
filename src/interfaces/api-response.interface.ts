import { ApiProperty } from '@nestjs/swagger';

export class JobOfferResponse {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Senior Software Engineer' })
  title: string;

  @ApiProperty({ example: 'Tech Corp' })
  company: string;

  @ApiProperty({
    example: 'Full-time position. Required skills: JavaScript, Node.js, React',
  })
  description: string;

  @ApiProperty({ example: 'New York, USA' })
  location: string;

  @ApiProperty({ example: 120000 })
  minSalary: number;

  @ApiProperty({ example: 180000 })
  maxSalary: number;

  @ApiProperty({ example: 'API1' })
  sourceApi: string;

  @ApiProperty({ example: 'API1_123' })
  externalId: string;

  @ApiProperty({ example: '2024-02-24T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-24T12:00:00Z' })
  updatedAt: Date;
}

export class PaginatedJobOffersResponse {
  @ApiProperty({ type: [JobOfferResponse] })
  items: JobOfferResponse[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class FetchJobOffersResponse {
  @ApiProperty({ example: 'Job offers fetch completed' })
  message: string;
}

export class CreateTestDataResponse {
  @ApiProperty({ example: 'Test data created successfully' })
  message: string;
} 