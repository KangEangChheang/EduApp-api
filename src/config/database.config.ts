import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  dialect: process.env.DB_TYPE || 'postgres', // Postgres by default
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'eduapp',
}));
