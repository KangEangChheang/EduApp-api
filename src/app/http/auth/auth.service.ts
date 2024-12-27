import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDtos, RegisterDtos } from './auth-val.dtos';
import { UserRepository } from '../user/user.repository';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

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
            user.is_active = true;
            await user.save();

            return user.dataValues;

        } catch(error) {
            console.log(error)
            throw new BadRequestException(error.message);
        }
    }

    async register(body: RegisterDtos){
        try {
            const user = {
                ...body,
                isActive: true,
            }

            const new_user = await this._user_rep.createOne(user);

            return new_user;
        }
        catch(error) {  
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
    
}