import { ApiProperty } from "@nestjs/swagger";
import { IsInt,IsNotEmpty,IsString } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({
    type: String,
    description: 'Заголовок статьи'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Описание статьи'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Идентификатор автора статьи'
  })
  @IsInt()
  authorId: number;
}
