import { Injectable } from '@nestjs/common';
import { CreateArticleDto,CreateArticleResponse,INewsController,SanitizeService,Usecase } from '@test/common';
import { ArticlesRepository } from '../../db/articles/articles.repository';

@Injectable()
export class CreateArticleUsecase extends Usecase<INewsController['createArticle']> {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly sanitizeService: SanitizeService
  ) {
    super()
  }
  public excecute(dto: CreateArticleDto) {
    return super.excecute(dto)
  }

  async handler(dto: CreateArticleDto): Promise<CreateArticleResponse> {
    const content=this.sanitizeService.sanitize(dto.content);
    return await this.articlesRepository.createArticle({
      ...dto,
      content
    });
  }
}