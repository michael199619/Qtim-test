import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString,Length } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        type: String,
        description: 'Логин пользователя',
        example: 'katya'
    })
    @IsString()
    @IsNotEmpty()
    @Length(5)
    login: string;

    @ApiProperty({
        type: String,
        description: 'Пароль пользователя',
        example: 'password'
    })
    @IsString()
    @IsNotEmpty()
    @Length(5)
    password: string;
}