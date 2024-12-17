import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { generateIdHooks } from './hook/generate-id.hook';
import Models from '../models';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get<Dialect>('database.dialect'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadModels: false, // Automatically loads models (e.g., User)
        synchronize: false,    // Syncs models with DB schema, avoid in production
        // add some more function and logic before and after using database function like before creating a row or after creating a row
        hooks: {
          ...generateIdHooks
        },
      }),
    }),
    SequelizeModule.forFeature(Models), // register all ur models here
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
