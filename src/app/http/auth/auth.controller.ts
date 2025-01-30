import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { GuestGuard } from 'app/common/auth/guards/guest.guard';
import { AuthService } from './auth.service';
import { LoginDtos, LoginOTPDtos, RegisterDtos, SendOtpDto } from './auth-val.dtos';
import { UserDtos } from '../user/user.dtos';
import { JwtHelper } from 'app/common/helpers/jwt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

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
        return await this._authservice.register(body);
    }

    @Post('verify-google')
    async authenticateWithGoogle(@Body('token_id') token_id: string) {
        try {
            // Verify the ID token with Google's API
            const response = await axios.get(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${token_id}`,
            );

            // Example: Check if the user exists in the database (mocked here)
            const user = await this._authservice.loginGoogle(response.data);

            // Generate your own JWT (optional)
            return {
                message: "login successfully",
                user: new UserDtos(user),
                token: this.jwtHelper.generateToken(user)
            }
        } catch (error) {
            console.error('Token verification failed:', error.message);
            throw new Error('Invalid Google token');
        }
    }

    @Post('send-otp')
    async sendOTP(@Body() body: SendOtpDto) {

        if (!body.email) {
            throw new BadRequestException('Email required');
        }

        return await this._authservice.sendOTP(body.email);
    }

    @Post('verify-otp')
    async verifyOTP(@Body() body: LoginOTPDtos) {
        return await this._authservice.verifyOTP(body);
    }





    // this will not be used at all just ganna put it here because i might want to test it later
    // i even hide the route with @ApiExcludeEndpoint()




    // Google OAuth redirect route (wont be used just ganna put it here because i might want to test)
    @ApiExcludeEndpoint()
    @Get('google')
    async googleAuth() {
        try {
            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${process.env.GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
            `&response_type=code` + 
            `&scope=openid email`; // Minimum scope

            // url for frontend to redirect the user to Google OAuth login
            return {
                url: googleAuthUrl
            }
        } catch(error){
            console.log(error)
        }
    }

    // Google OAuth callback route (after user authenticates) (wont be used just ganna put it here because i might want to test)
    @ApiExcludeEndpoint()
    @Get('google/callback')
    async googleCallback(@Query('code') code: string) {
        try {
            // Step 1: Exchange the code for an access token
            const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
                params: {
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
                },
            });

            const { access_token, id_token } = tokenResponse.data;

            // Step 2: Decode the ID Token to get user info
            const decodedToken: any = jwt.decode(id_token);

            // Extract user data
            const googleUser = {
                google_id: decodedToken.sub,  // Google ID
                email: decodedToken.email,
                username: decodedToken.given_name + decodedToken.family_name,
                avatar: decodedToken.picture, // Profile picture URL
            };

            // Step 3: Create or update user in your database
            const user = await this._authservice.loginGoogle(googleUser);


            return {
                message: "Register successfully",
                // user: new UserDtos(user),
                token: this.jwtHelper.generateToken(user)
            }
        } catch (error) {
            throw new HttpException('Google Authentication Failed', HttpStatus.UNAUTHORIZED);
        }
    }
    
}