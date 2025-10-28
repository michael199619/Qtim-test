import { ApiProperty } from "@nestjs/swagger";
import { IsArray,IsOptional,IsUUID } from "class-validator";
import { PaginationDto } from "../../../../utils";

export class GetUsersDto extends PaginationDto {
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Список идентификаторов пользователей',
  })
  @IsOptional()
  @IsUUID(undefined,{ each: true })
  @IsArray()
  ids: string[]=[];
}
