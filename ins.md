# Job Offer Aggregator Backend Application

This is a NestJS backend application that integrates with two different APIs to fetch job offer data, transforms the data into a unified structure, stores it in a database, and provides an API to retrieve and filter the transformed data.

## Features
1. **Data Transformation**:
   - Fetches data from two APIs with different structures.
   - Transforms the data into a unified structure.
   - Scalable and maintainable transformation process.
   - Prevents duplication of data.

2. **Scheduled Data Fetching**:
   - Uses a cron job to periodically fetch data from the APIs.
   - Configurable scheduling via environment variables.

3. **Database Storage**:
   - Stores transformed data in a PostgreSQL database.
   - Well-structured and optimized database schema.
   - Prevents duplicate data storage.

4. **API Development**:
   - Provides an API endpoint `/api/job-offers` to retrieve and filter job offers.
   - Supports filtering by job title, location, and salary range.
   - Paginates results.
   - Includes robust error handling.

5. **Error Handling**:
   - Handles API call failures, database errors, and invalid queries.
   - Provides clear error messages in API responses.

6. **Testing**:
   - Includes unit tests for data transformation, scheduler, and API endpoints.
   - Integration tests for end-to-end functionality.

---

## Setup Instructions

### Prerequisites
1. Node.js (v16 or higher)
2. PostgreSQL
3. NestJS CLI (`npm install -g @nestjs/cli`)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/salarvand/job-offer-aggregator.git
   cd job-offer-aggregator