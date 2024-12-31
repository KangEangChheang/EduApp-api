import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import Models from '../models';
import { MigrationInitializer } from './migrations/migration-initializer';
import { SeederInitializer } from './seeders/seed-initializer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigService available globally
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        dialect: process.env.DB_DIALECT as Dialect,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadModels: false, // Automatically loads models (e.g., User)
        synchronize: false,    // Syncs models with DB schema, avoid in production
        logging: false,
        models: Models
      }),
    }),
    SequelizeModule.forFeature(Models), // register all ur models here
  ],
  providers: [
    MigrationInitializer, 
    SeederInitializer
  ],
  exports: [
    SequelizeModule,
    MigrationInitializer,
    SeederInitializer
  ],
})
export class DatabaseModule {}
