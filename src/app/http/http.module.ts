import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ProfileModule,
    ],
})
export class HttpModule {};