// ===========================================================================>> Core Library
import { Module } from '@nestjs/common';

// ===========================================================================>> Custom Library
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { HelperModule } from 'app/common/helpers/helper.module';

@Module({
    imports: [
        HelperModule
    ],
    controllers: [ProfileController],
    providers: [ProfileService]
})

export class ProfileModule { }
