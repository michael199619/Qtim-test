import { HttpStatus,Injectable,NotFoundException } from '@nestjs/common';
import { CacheService,DeleteArticleDto,DeleteArticleResponse,INewsController,Usecase } from '@test/common';
import { ArticlesRepository } from '../../db/articles/articles.repository';

@Injectable()
export class DeleteArticleUsecase extends Usecase<INewsController['deleteArticle']> {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly cacheService: CacheService
  ) {
    super()
  }

  excecute(dto: DeleteArticleDto) {
    return super.excecute(dto)
  }

  async handler(dto: DeleteArticleDto): Promise<DeleteArticleResponse> {
    if (!await this.articlesRepository.getArticleById(dto.id)) {
      throw new NotFoundException()
    }

    await Promise.all([
      this.articlesRepository.deleteArticle(dto.id),
      this.cacheService.invalidate(dto.id)
    ]);

    return {
      status: HttpStatus.OK
    }
  }
}
