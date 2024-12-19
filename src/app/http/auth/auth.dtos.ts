import { IsString, IsNotEmpty } from "class-validator";

export class LoginDtos {
    @IsString()
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}

export class RegisterDtos {
    @IsString()
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Username is required" })
    username: string;

    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}

