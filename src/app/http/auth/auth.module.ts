import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HelperModule } from 'app/common/helpers/helper.module';
import { EmailService } from 'app/services/email.service';

@Module({
    imports: [
        HelperModule
    ],
    controllers: [AuthController],
    providers: [AuthService, EmailService],
})
export class AuthModule {};