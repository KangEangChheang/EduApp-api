import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDtos, RegisterDtos } from './auth.dtos';
import { UserRepository } from '../user/user.repository';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'models/user/user-role.model';

@Injectable()
export class AuthService {
    private readonly _user_rep = new UserRepository();
    constructor(
        private configService: ConfigService,
    ) {}

    async login(body: LoginDtos) {
        try { 
            const user = await this._user_rep.findByEmail(body.email);

            //check if user exist
            if(!user) throw new ForbiddenException("Email or Password is incorrect");
            
            //check if password is correct
            const isMatch = await bcrypt.compare(body.password, user.password);
            if(!isMatch) throw new ForbiddenException("Email or Password is incorrect");   
            
            //set user to be active
            user.isActive = true;
            await user.save();

            return user;

        } catch(error) {
            throw new BadRequestException(error.message);
        }
    }

    async register(body: RegisterDtos){
        try {
            const default_role = await UserRole.findOne({ where: { role: 'Student' }});
            const user = {
                ...body,
                isActive: true,
                user_role_id: default_role.id
            }

            const new_user = await this._user_rep.createOne(user);

            return new_user;
        }
        catch(error) {  
            throw new BadRequestException(error.message);
        }
    }
    
}