import { ApiProperty,PartialType,PickType } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import { CreateUserDto } from "../create-user";
export class EditUserDto extends PartialType(PickType(CreateUserDto,['name','login'])) {

    @ApiProperty({
        type: Number,
        description: 'Идентификатор пользователя'
    })
    @IsInt()
    id: number;
}