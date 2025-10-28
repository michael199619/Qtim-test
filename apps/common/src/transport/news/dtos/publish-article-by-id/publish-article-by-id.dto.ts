import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { randomUUID } from "crypto";

export class PublishArticleByIdDto {
  @ApiProperty({
    type: String,
    description: 'Идентификатор статьи',
    example: randomUUID()
  })
  @IsUUID()
  id: string;
}
