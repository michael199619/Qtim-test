import { ApiProperty } from "@nestjs/swagger";
import { IsInt,IsUUID } from "class-validator";
import { randomUUID } from "crypto";

export class GetUserDto {
    @ApiProperty({
        type: Number,
        description: 'Идентификатор пользователя',
        example: randomUUID()
    })
    @IsInt()
    @IsUUID(4)
    id: number;
}