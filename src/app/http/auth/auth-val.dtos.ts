import { IsString, IsNotEmpty, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDtos {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}

export class LoginOTPDtos {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "OTP is required" })
    otp: string;
}

export class RegisterDtos {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Username is required" })
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}


export class SendOtpDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Invalid email format' })
    @IsOptional()
    email?: string;
}

