import { NestFactory } from "@nestjs/core";
import { DatabaseModule } from "../database.module";
import { SeederInitializer } from "./seed-initializer";


async function run_seeder() {
    const app = await NestFactory.createApplicationContext(DatabaseModule);
    const seedInitializer = app.get(SeederInitializer);
    await seedInitializer.startSeeding();
    await app.close();
}
run_seeder();