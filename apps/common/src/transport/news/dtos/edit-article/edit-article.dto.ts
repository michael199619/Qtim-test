import { ApiProperty,PickType } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { randomUUID } from "crypto";
import { CreateArticleDto } from "../create-article";

export class EditArticleDto extends PickType(CreateArticleDto,['title','description','content']) {
  @ApiProperty({
    type: String,
    description: 'Идентификатор статьи',
    example: randomUUID()
  })
  @IsUUID()
  id: string;
}
