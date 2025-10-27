import { ApiProperty,PickType } from "@nestjs/swagger";
import { IsNotEmpty,IsString,Length } from "class-validator";
import { GetUserDto } from "../get-user";

export class ChangePasswordUserDto extends PickType(GetUserDto,['id']) {
    @ApiProperty({
        type: String,
        description: 'Старый пароль'
    })
    @IsString()
    @IsNotEmpty()
    @Length(5)
    oldPassword: string;

    @ApiProperty({
        type: String,
        description: 'Новый пароль'
    })
    @IsString()
    @IsNotEmpty()
    @Length(5)
    newPassword: string;
}