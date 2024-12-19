import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { generateIdHooks } from './hook/generate-id.hook';
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
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get<string>('DB_DIALECT', 'postgres') as Dialect,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'eduapp'),
        autoLoadModels: false, // Automatically loads models (e.g., User)
        synchronize: false,    // Syncs models with DB schema, avoid in production
        logging: false,

        // add some more function and logic before and after using database function like before creating a row or after creating a row
        hooks: {
          ...generateIdHooks
        },
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
