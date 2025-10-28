import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { randomUUID } from "crypto";

export class GetArticleByIdDto {
  @ApiProperty({
    type: String,
    description: 'Идентификатор статьи',
    example: randomUUID()
  })
  @IsUUID()
  id: string;
}
