import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '../../database/database.module';
import { MigrationInitializer } from './migration-initializer';

async function run_migrate() {
    const app = await NestFactory.createApplicationContext(DatabaseModule);
    const migrationInitializer = app.get(MigrationInitializer);
    await migrationInitializer.startMigration();
    await app.close();
}

run_migrate();
