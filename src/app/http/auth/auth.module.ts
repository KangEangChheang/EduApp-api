import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HelperModule } from 'app/common/helpers/helper.module';

@Module({
    imports: [
        HelperModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {};