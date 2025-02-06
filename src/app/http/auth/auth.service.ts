import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDtos, VerifyOTPDtos, RegisterDtos } from './auth-val.dtos';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';
import { User } from 'models/user/user.model';
import { Op } from 'sequelize';
import { EmailService } from 'app/services/email.service';
import UserOTP from 'models/user/user_otps.model';
import { JwtHelper } from 'app/common/helpers/jwt';
import { UserDtos } from '../user/user.dtos';

@Injectable()
export class AuthService {

    private readonly _user_rep = new UserRepository();

    constructor(
        private readonly emailService: EmailService,
        private readonly jwtHelper: JwtHelper
    ) {}

    async login(body: LoginDtos) {
        try { 
            const user = await this._user_rep.findByEmail(body.email);

            //check if user exist
            if(!user) throw new ForbiddenException("Email or Password is incorrect");

            // Check if user is active
            if (!user.is_active) throw new ForbiddenException("Your account is inactive. Please contact support.");
            
            //check if password is correct
            const isMatch = await bcrypt.compare(body.password, user.password);
            if(!isMatch) throw new ForbiddenException("Email or Password is incorrect");   
            
            return user.dataValues;

        } catch(error) {
            console.log(error)
            throw new BadRequestException(error.message);
        }
    }

    async loginGoogle(google_user: any){
        const { email, name, sub, picture } = google_user;

        const data = {
            email: email,
            username: name,
            google_id: sub,
            is_active: true,
            avatar: picture,
            password: '',
        }

        const user = await this._user_rep.findorCreateByGoogleId(data);
        if(user) return user;
        else throw new NotFoundException("User not found or something went wrong try again");
        
    }

    // Create user but is_active = false. VerifyOTP to change status.
    async register(body: RegisterDtos){
        try {

            const { username, email, password } = body;

            // Check if the user already exists by email
            let existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ email }],
                },
            });

            if (existingUser) {
                return {
                    status: true,
                    message: 'User already exist',
                };
            }

            const user = {
                ...body,
                is_active: false,
            }

            const new_user = await this._user_rep.createOne(user);

            return {
                message: "Register successfully",
                user: new UserDtos(new_user),
                token: this.jwtHelper.generateToken({
                    username: new_user.username,
                    email: new_user.email,            
                })
            };
        }
        catch(error) {  
            console.log(error)
            throw new BadRequestException(error.message);
        }
    }

    // Generate a 6-digit OTP
    private _generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP to user via email or SMS
    async sendOTP(email: string): Promise<{ data: boolean; message: string }> {
        try {

            // Input validation
            if (!email) {
                throw new BadRequestException('Email or phone is required');
            }

            const user = await this._user_rep.findByEmail(email);

            if (!user) {
                throw new BadRequestException('User not found or inactive');
            }

            // Generate OTP and save it to the database
            const otp = this._generateOTP();
            await UserOTP.create({
                user_id: user.id,
                otp,
                expires_at: new Date(Date.now() + 1 * 60 * 1000), // OTP valid for 2 minute
            });

            // Send OTP via email or SMS
            await this.emailService.sendHTMLMessage(
                user.email,
                'Your OTP Code',
                `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 1 minute.</p>`
            );

            return {
                data: true,
                message: 'OTP sent successfully'
            };
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new InternalServerErrorException('Failed to send OTP. Please try again later.');
        }
    }
    
    async verifyOTP(body: VerifyOTPDtos): Promise<{ token: string; user: UserDtos, message: string }> {
        try {

            const user = await this._user_rep.findByEmail(body.email);

            if (!user) {
                throw new BadRequestException('User not found');
            }

            // Check if the OTP exists and is valid
            const userOtp = await UserOTP.findOne({
                where: {
                    user_id: user.id,
                    otp: body.otp,
                    expires_at: { [Op.gt]: new Date() }, // Ensure OTP is not expired
                },
            });

            user.is_active = true;

            // OTP is valid, delete it to prevent reuse
            await userOtp.destroy();
            await user.save();

            const token = this.jwtHelper.generateToken({
                username: user.username,
                email: user.email,            
            });

            return {
                message: 'Login Successful',
                user: new UserDtos(user),
                token: token,
            }
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    async verifyResetOTP(body: VerifyOTPDtos): Promise<{ message: string }> {
        try {

            const user = await this._user_rep.findByEmail(body.email);

            if (!user) {
                throw new BadRequestException('User not found');
            }

            // Check if the OTP exists and is valid
            const userOtp = await UserOTP.findOne({
                where: {
                    user_id: user.id,
                    otp: body.otp,
                    expires_at: { [Op.gt]: new Date() }, // Ensure OTP is not expired
                },
            });

            // OTP is valid, delete it to prevent reuse
            await userOtp.destroy();

            return {
                message: 'OTP verified successfully. Please reset your password.',
            }
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    async resetPassword(body: { email: string; password: string }): Promise<{ message: string }> {
        try {

            console.log(body)
            const user = await this._user_rep.findByEmail(body.email);
    
            if (!user) {
                throw new BadRequestException('User with this email does not exist.');
            }
    
            const hashedPassword = await bcrypt.hash(body.password, 10);
    
            const [updated] = await User.update(
                { password: hashedPassword },  
                { where: { email: body.email } }
            );
    
            if (updated === 0) {
                throw new BadRequestException('Failed to update password. Please try again.');
            }
    
            return {
                message: 'Password reset successfully. Please log in with the new password.',
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to reset the password. Please try again later.');
        }
    }

}