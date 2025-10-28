import { ApiProperty,PartialType,PickType } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { randomUUID } from "crypto";
import { CreateUserDto } from "../create-user";

export class EditUserDto extends PartialType(PickType(CreateUserDto,['name','login'])) {
    @ApiProperty({
        type: String,
        description: 'Идентификатор статьи',
        example: randomUUID()
    })
    @IsUUID()
    id: string;
}