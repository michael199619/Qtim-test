import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum,IsInt,IsOptional,IsString } from "class-validator";
import { PaginationDto } from "../../../../utils/pagination";
import { ArticleStatus } from "../get-article-by-id";

export class GetArticlesDto extends PaginationDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'Идентификатор статьи'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Идентификатор пользователя'
  })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Идентификатор автора статьи'
  })
  @IsOptional()
  authorId?: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Статьи старше даты',
    example: '2025-10-24'
  })
  @IsOptional()
  dateFrom?: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Статьи младше даты',
    example: '2025-11-01'
  })
  @IsOptional()
  dateTo?: Date;

  @ApiProperty({
    enum: ArticleStatus,
    required: false,
    description: 'статус статьи'
  })
  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Только чьи-то или свои статьи'
  })
  @IsOptional()
  @Transform(({ value }) => value!==undefined? value==='true':undefined)
  isMy?: boolean;
}
