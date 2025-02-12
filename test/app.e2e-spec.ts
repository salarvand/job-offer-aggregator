import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('JobOffersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Global pipes and filters
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger setup for e2e tests
    const config = new DocumentBuilder()
      .setTitle('Job Offers API')
      .setDescription('API for aggregating and searching job offers')
      .setVersion('1.0')
      .addTag('Job Offers')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    SwaggerModule.setup('', app, document);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/job-offers', () => {
    it('should return paginated job offers', () => {
      return request(app.getHttpServer())
        .get('/api/job-offers')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('totalPages');
        });
    });

    it('should filter job offers by title', () => {
      return request(app.getHttpServer())
        .get('/api/job-offers?title=Engineer')
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toBeDefined();
          expect(Array.isArray(res.body.items)).toBeTruthy();
        });
    });
  });

  describe('POST /api/job-offers/test-data', () => {
    it('should create test data', () => {
      return request(app.getHttpServer())
        .post('/api/job-offers/test-data')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Test data created successfully');
        });
    });
  });

  describe('POST /api/job-offers/fetch', () => {
    it('should trigger job offers fetch', () => {
      return request(app.getHttpServer())
        .post('/api/job-offers/fetch')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Job offers fetch completed');
        });
    });
  });

  describe('GET /api/docs', () => {
    it('should return swagger documentation', () => {
      return request(app.getHttpServer())
        .get('/api/docs')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res) => {
          expect(res.text).toContain('swagger');
        });
    });
  });

  describe('GET /', () => {
    it('should return swagger documentation', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res) => {
          expect(res.text).toContain('swagger');
        });
    });
  });
});
