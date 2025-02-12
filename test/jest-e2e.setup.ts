import { config } from 'dotenv';
config(); // Load environment variables

jest.setTimeout(30000); // Increase timeout for e2e tests 