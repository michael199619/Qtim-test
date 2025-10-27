import { ApiProperty } from "@nestjs/swagger";
import { IsArray,IsInt } from "class-validator";
import { PaginationDto } from "../../../../utils";

export class GetUsersDto extends PaginationDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    required: false,
    description: 'Список дентификаторов пользователей',
  })
  @IsInt({ each: true })
  @IsArray()
  ids: number[];
}
