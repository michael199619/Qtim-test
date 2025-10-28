import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { randomUUID } from "crypto";

export class GetUserResponse {
    @ApiProperty({
        type: String,
        description: 'Идентификатор пользователя',
        example: randomUUID()
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
        description: 'Имя пользователя',
        example: 'Яся'
    })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Логин пользователя',
        example: 'yara'
    })
    login: string;
}