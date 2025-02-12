import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  try {
    // First, connect to postgres database to create our database if it doesn't exist
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'postgres', // Connect to default postgres database
    });

    const dbName = process.env.DB_NAME;

    // Check if database exists
    const result = await connection.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`,
    );

    // Create database if it doesn't exist
    if (result.length === 0) {
      await connection.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    await connection.close();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase(); 