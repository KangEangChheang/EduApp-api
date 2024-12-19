import { Sequelize } from 'sequelize-typescript';
import "colors";
import * as readlineSync from 'readline-sync';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MigrationInitializer {

    constructor(private sequelize: Sequelize) {}

    private async confirmMigration(): Promise<boolean> {
        const tableNames = await this.sequelize.getQueryInterface().showAllTables();
        if (tableNames.length > 0) {
            const message = 'This will drop and recreate all tables. Are you sure you want to proceed?'.yellow;
            return readlineSync.keyInYNStrict(message);
        }
        return true;
    }

    private async dropAndRecreateTables() {
        await this.sequelize.sync({ force: true });
    }

    private async handleMigrationError(error: Error) {
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(1); // Use exit code 1 for errors
    }

    public async startMigration() {
        try {
            // const confirmation = await this.confirmMigration();
            // if (!confirmation) {
            //     console.log('\nMigration aborted.'.cyan);
            // }

            await this.dropAndRecreateTables();
            console.log('\nMigration completed successfully.'.green);
            
        } catch (error) {
            await this.handleMigrationError(error);
        }
    }
}