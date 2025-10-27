import { ApiProperty,PickType } from "@nestjs/swagger";
import { IsNotEmpty,IsString } from "class-validator";
import { GetUserDto } from "../get-user";

export class RefreshTokenUserDto extends PickType(GetUserDto,['id']) {
    @ApiProperty({
        type: String,
        description: 'Рефреш токен пользователя'
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}