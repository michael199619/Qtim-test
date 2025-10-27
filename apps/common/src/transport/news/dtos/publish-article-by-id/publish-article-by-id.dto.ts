import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class PublishArticleByIdDto {
  @ApiProperty({
    type: Number,
    description: 'Идентификатор статьи'
  })
  @IsInt()
  id: number;
}
