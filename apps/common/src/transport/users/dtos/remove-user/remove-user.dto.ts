import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class RemoveUserDto {
    @ApiProperty({
        type: Number,
        description: 'Идентификатор пользователя',
    })
    @IsInt()
    id: number;
}