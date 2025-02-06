import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UpdatePasswordDto, UpdateUserDto } from './profile.dto';
import { ProfileService } from './profile.service';
import { UserGuard } from 'app/common/auth/guards/user.guard';
import { User } from 'models/user/user.model';
import { UserDecorator } from 'app/common/decorators/UserDecorator';

@UseGuards(UserGuard)
@Controller('profile')
export class ProfileController {

    constructor(
        private _service: ProfileService
    ) { }

    @Put('/update')
    async updateProfile(@UserDecorator() auth: User, @Body() body: UpdateUserDto) {
        return await this._service.update(auth.id, body);
    }

    @Put('/update-password')
    async updatePassword(@UserDecorator() auth: User, @Body() body: UpdatePasswordDto): Promise<{ message: string }> {
        return await this._service.updatePassword(auth.id, body);
    }
}
