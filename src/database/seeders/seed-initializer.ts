import "colors";
import * as readlineSync from 'readline-sync';
import { Sequelize } from 'sequelize-typescript';
import { Injectable } from "@nestjs/common";
import { userSeeder } from "./data/user.seeder";

@Injectable()
export class SeederInitializer {


    constructor(
        private sequelize: Sequelize,
    ) {}

    private async seedData() {
        // write ur seed data logic here
        await userSeeder();
    }

    private async confirmSeeding(): Promise<boolean> {
        const tableNames = await this.sequelize.getQueryInterface().showAllTables();
        if (tableNames.length > 0) {
            const message = 'This will drop and seed again. Are you sure you want to proceed?'.yellow;
            return readlineSync.keyInYNStrict(message);
        }
        return true;
    }

    private async dropAndSyncDatabase() {
        await this.sequelize.sync({ force: true });
    }

    private async handleSeedingError(error: Error) {
        await this.sequelize.sync({ force: true });
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);
    }

    public async startSeeding() {
        try {
            //no need to confirm anything we know we are going to seed
            // const confirmation = await this.confirmSeeding();
            // if (!confirmation) {
            //     console.log('\nSeeders have been cancelled.'.cyan);
            // }

            // await this.dropAndSyncDatabase(); dont migrate data again
            await this.seedData();
            console.log('\nSeeders completed.'.green);
            
        } catch (error) {
            await this.handleSeedingError(error);
        }
    }
}
