import { HttpStatus,Injectable,NotFoundException } from '@nestjs/common';
import { CacheService,EditArticleDto,EditArticleResponse,INewsController,Usecase } from '@test/common';
import { ArticlesRepository } from '../../db/articles/articles.repository';

@Injectable()
export class EditArticleUsecase extends Usecase<INewsController['editArticle']> {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly cacheService: CacheService
  ) {
    super()
  }

  public excecute(dto: EditArticleDto) {
    return super.excecute(dto)
  }

  async handler(dto: EditArticleDto): Promise<EditArticleResponse> {
    if (!await this.articlesRepository.getArticleById(dto.id)) {
      throw new NotFoundException()
    }

    await Promise.all([
      this.articlesRepository.editArticle(dto),
      this.cacheService.invalidate(dto.id)
    ]);

    return {
      status: HttpStatus.OK
    }
  }
}
