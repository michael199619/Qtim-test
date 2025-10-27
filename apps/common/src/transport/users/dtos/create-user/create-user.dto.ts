import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString,Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'Имя пользователя',
        example: 'Катя'
    })
    @IsString()
    @IsNotEmpty()
    @Length(2)
    name: string;

    @ApiProperty({
        type: String,
        description: 'Логин пользователя',
        example: 'katya'
    })
    @IsString()
    @IsNotEmpty()
    @Length(4)
    login: string;

    @ApiProperty({
        type: String,
        description: 'Пароль',
        example: 'password'
    })
    @IsString()
    @IsNotEmpty()
    @Length(5)
    password: string;
}