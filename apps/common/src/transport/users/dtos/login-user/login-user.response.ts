import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class LoginUserResponse {
    @ApiProperty({
        type: String,
        description: 'Идентификатор пользователя',
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        type: String,
        description: 'Токен пользователя'
    })
    accessToken: string;

    @ApiProperty({
        type: String,
        description: 'Рефреш токен пользователя'
    })
    refreshToken: string;
}