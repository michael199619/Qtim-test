import { Injectable } from '@nestjs/common';
import { CreateArticleDto,CreateArticleResponse,INewsController,Usecase } from '@test/common';
import { ArticlesRepository } from '../../db/articles/articles.repository';

@Injectable()
export class CreateArticleUsecase extends Usecase<INewsController['createArticle']> {
  constructor(
    private readonly articlesRepository: ArticlesRepository
  ) {
    super()
  }
  public excecute(dto: CreateArticleDto) {
    return super.excecute(dto)
  }

  async handler(dto: CreateArticleDto): Promise<CreateArticleResponse> {
    return await this.articlesRepository.createArticle(dto);
  }
}