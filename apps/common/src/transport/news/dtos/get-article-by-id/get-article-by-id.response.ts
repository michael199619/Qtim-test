import { ApiProperty } from "@nestjs/swagger";

export enum ArticleStatus {
  DRAFT='draft',
  PUBLISH='publish'
}

export class GetArticleByIdResponse {
  @ApiProperty({
    type: String,
    description: 'Идентификатор статьи'
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Заголовок статьи'
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Описание статьи'
  })
  description: string;

  @ApiProperty({
    type: String,
    description: 'Контент статьи'
  })
  content: string;

  @ApiProperty({
    type: String,
    description: 'Идентификатор автора статьи'
  })
  authorId: string;

  @ApiProperty({
    type: String,
    description: 'Имя автора статьи'
  })
  authorName: string;

  @ApiProperty({
    type: Date,
    description: 'Дата публикации статьи'
  })
  publishedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Дата обновления статьи'
  })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Дата создания статьи'
  })
  createdAt: Date;

  @ApiProperty({
    enum: ArticleStatus,
    description: 'Статус статьи'
  })
  status: ArticleStatus;
}
