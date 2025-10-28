import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString,IsUUID } from "class-validator";
import { randomUUID } from "crypto";

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
    type: String,
    description: 'Идентификатор автора статьи',
    example: randomUUID()
  })
  @IsUUID()
  authorId: string;
}
