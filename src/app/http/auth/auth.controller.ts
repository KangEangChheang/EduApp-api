import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GuestGuard } from 'src/app/common/auth/guards/guest.guard';
import { AuthService } from './auth.service';

@UseGuards(GuestGuard)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly _authservice: AuthService,
    ){}
    
}