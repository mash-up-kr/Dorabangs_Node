import { DataSource } from 'typeorm';

require('dotenv').config();

export const dbConfig: any = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNC,
  logging: process.env.DB_LOGGING,
  migrations: ['migrations/*.js'],
};

export const AppDataSource = new DataSource(dbConfig);
