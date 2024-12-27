import { IsString, IsNotEmpty } from "class-validator";
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

