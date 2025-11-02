import { Injectable,NotFoundException } from '@nestjs/common';
import { CacheService,GetArticleByIdDto,GetArticleByIdResponse,INewsController,Usecase,UserPublisher } from '@test/common';
import { firstValueFrom } from 'rxjs';
import { ArticlesRepository } from '../../db/articles/articles.repository';

@Injectable()
export class GetArticleByIdUsecase extends Usecase<INewsController['getArticleById']> {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly userPublisher: UserPublisher,
    private readonly cacheService: CacheService
  ) {
    super()
  }

  public excecute(dto: GetArticleByIdDto) {
    return super.excecute(dto)
  }

  async handler(dto: GetArticleByIdDto): Promise<GetArticleByIdResponse> {
    const article=await this.articlesRepository.getArticleById(dto.id);

    if (!article) {
      throw new NotFoundException()
    }

    const user=await firstValueFrom(this.userPublisher.getUser({ id: article.authorId }))

    const res={
      ...article,
      authorName: user.name||''
    };

    this.cacheService.set(article.id,res).then();

    return res;
  }
}
