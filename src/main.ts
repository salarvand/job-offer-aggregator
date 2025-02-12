import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Job Offers API')
    .setDescription(`
      API for aggregating and searching job offers from multiple sources.
      
      ## Features
      - Search job offers by title, location, and salary range
      - Pagination support
      - Automatic job offers aggregation from multiple sources
      - Manual trigger for job offers fetch
      - Test data generation
      
      ## Rate Limiting
      This API implements rate limiting to ensure fair usage:
      - Time Window: 60 seconds
      - Request Limit: 10 requests per time window
      - When limit is exceeded, requests will receive a 429 (Too Many Requests) response
      
      ## Error Responses
      - 400 Bad Request: Invalid parameters
      - 429 Too Many Requests: Rate limit exceeded
      - 500 Internal Server Error: Server-side error
      
      ## Pagination
      All list endpoints support pagination with the following parameters:
      - page: Page number (default: 1)
      - limit: Items per page (default: 10)
      
      ## Filtering
      Job offers can be filtered by:
      - title: Search in job titles
      - location: Search in locations
      - minSalary: Minimum salary filter
      - maxSalary: Maximum salary filter
    `)
    .setVersion('1.0')
    .addTag('Job Offers', 'Operations related to job offers')
    .addServer('http://localhost:3000', 'Local development')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Set up Swagger at root and /api/docs
  SwaggerModule.setup('', app, document); // Root path
  SwaggerModule.setup('api/docs', app, document); // Keep the /api/docs path as well

  // Start the application
  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`Swagger documentation is available at: http://localhost:${port}`);
}
bootstrap();
