import { Body, Controller, Get, HttpException, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { GuestGuard } from 'app/common/auth/guards/guest.guard';
import { AuthService } from './auth.service';
import { LoginDtos, RegisterDtos } from './auth.dtos';
import { UserDtos } from '../user/user.dtos';
import { JwtHelper } from 'app/common/helpers/jwt';

@UseGuards(GuestGuard)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly _authservice: AuthService,
        private readonly jwtHelper: JwtHelper
    ){}
    
    @Post("/login")
    async login(@Body() body: LoginDtos){
        const res = await this._authservice.login(body);

        return {
            message: "Login successfully",
            user: new UserDtos(res),
            token: this.jwtHelper.generateToken(res)
        }
    }

    @Post("/register")
    async register(@Body() body: RegisterDtos){
        const res = await this._authservice.register(body);
        return {
            message: "Register successfully",
            user: new UserDtos(res),
            token: this.jwtHelper.generateToken(res)
        }
    }
    
}