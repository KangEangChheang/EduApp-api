import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';

@Module({
    imports: [
        AuthModule,
        UserModule,
    ],
    providers: [
        AuthService,
    ],
})
export class HttpModule {};