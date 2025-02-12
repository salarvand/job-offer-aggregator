# Job Offers Aggregator API

A NestJS-based REST API that aggregates job offers from multiple sources and provides a unified search interface.

## Features

- Aggregate job offers from multiple external APIs
- Search and filter job offers by title, location, and salary range
- Automatic periodic job offers fetch
- Rate limiting for API endpoints
- Swagger API documentation
- Pagination support
- Test data generation

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Swagger/OpenAPI
- Jest (Testing)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/salarvand/job-offer-aggregator.git
cd job-offer-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file based on .env.example:
```bash
cp .env.example .env
```

4. Update the .env file with your configuration

5. Initialize the database:
```bash
npm run db:init
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at http://localhost:3000
Swagger documentation is available at http://localhost:3000/api/docs

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

Full API documentation is available through Swagger UI at `/api/docs` when the application is running.

### Main Endpoints

- GET `/api/job-offers` - Get paginated job offers with filtering
- POST `/api/job-offers/fetch` - Manually trigger job offers fetch
- POST `/api/job-offers/test-data` - Generate test data

## Rate Limiting

The API implements rate limiting:
- 10 requests per minute per IP address
- Applies to all endpoints
- Returns 429 Too Many Requests when limit is exceeded

## License

[MIT](LICENSE)
