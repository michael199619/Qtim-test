import { HttpStatus,Injectable,NotFoundException } from '@nestjs/common';
import { INewsController,PublishArticleByIdDto,PublishArticleByIdResponse,Usecase } from '@test/common';
import { ArticlesRepository } from '../../db/articles/articles.repository';

@Injectable()
export class PublishArticleByIdUsecase extends Usecase<INewsController['publishArticleById']> {
  constructor(
    private readonly articlesRepository: ArticlesRepository
  ) {
    super()
  }

  public excecute(dto: PublishArticleByIdDto) {
    return super.excecute(dto)
  }

  async handler(dto: PublishArticleByIdDto): Promise<PublishArticleByIdResponse> {
    if (!await this.articlesRepository.getArticleById(dto.id)) {
      throw new NotFoundException()
    }

    await this.articlesRepository.publishArticleById(dto.id);

    return {
      status: HttpStatus.OK
    }
  }
}
