import { ApiProperty } from "@nestjs/swagger";

export class LoginUserResponse {
    @ApiProperty({
        type: Number,
        description: 'Идентификатор пользователя'
    })
    userId: number;

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