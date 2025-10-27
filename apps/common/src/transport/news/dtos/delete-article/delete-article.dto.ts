import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteArticleDto {
  @ApiProperty({
    type: Number,
    description: 'Идентификатор статьи'
  })
  @IsInt()
  id: number;
}
