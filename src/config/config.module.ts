import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { authConfig } from './auth.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Make config globally accessible
      load: [databaseConfig, , authConfig], // Register individual configs
    }),
  ],
})
export class ConfigModule {}
