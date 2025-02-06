import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    email: string
}

export class UpdatePasswordDto {

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    password: string

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    confirm_password: string
}