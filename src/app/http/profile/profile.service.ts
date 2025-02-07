import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePasswordDto, UpdateUserDto } from './profile.dto';
import { User } from 'models/user/user.model';
import { JwtHelper } from 'app/common/helpers/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfileService {

    constructor(
        private readonly jwtHelper: JwtHelper,
    ) { };

    async update(user_ID: number, body: UpdateUserDto): Promise<{ token: string; message: string }> {
        try {

            // Update the user's information (including avatar, if applicable)
            await User.update({
                username: body.username,
                email: body.email,
            }, { where: { id: user_ID } });

            // Fetch the updated user details (including their roles)
            const user = await User.findByPk(user_ID, {
                attributes: ['id', 'username', 'email',],
            });

            if (!user) {
                throw new BadRequestException('User not found');
            }

            const token = this.jwtHelper.generateToken({
                id: user.id,
                username: user.username,
                email: user.email,            
                createdAt: user.createdAt,            
            });

            return {
                message: 'Profile updated successfully',
                token: token,
            }

        } catch (error) {
            // Handle and throw specific errors
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Something went wrong during the update process.');
        }
    }

    async updatePassword(userId: number, body: UpdatePasswordDto): Promise<{ message: string }> {
    
        // Find user by ID
        const currentUser = await User.findByPk(userId);
        
        if (!currentUser) {
            throw new BadRequestException('Invalid user_id');
        }
    
        // Check if passwords match
        if (body.password !== body.confirm_password) {
            throw new BadRequestException('Password and Confirm password do not match');
        }
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(body.password, 10);  // Salting with 10 rounds
    
        // Update password in DB
        const [updated] = await User.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );
    
        if (updated === 0) {
            throw new BadRequestException('Failed to update password. Please try again.');
        }
    
        return { message: 'Password has been updated successfully.' };
    }
    
}
