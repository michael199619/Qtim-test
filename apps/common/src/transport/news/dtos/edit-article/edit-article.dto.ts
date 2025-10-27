import { ApiProperty,PickType } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import { CreateArticleDto } from "../create-article";

export class EditArticleDto extends PickType(CreateArticleDto,['title','description']) {
  @ApiProperty({
    type: Number,
    description: 'Идентификатор статьи'
  })
  @IsInt()
  id: number;
}
