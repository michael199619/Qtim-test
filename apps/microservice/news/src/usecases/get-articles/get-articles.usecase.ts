import { Injectable } from '@nestjs/common';
import { GetArticlesDto,GetArticlesResponse,INewsController,Usecase,UserPublisher } from '@test/common';
import { firstValueFrom } from 'rxjs';
import { ArticlesRepository } from '../../db/articles/articles.repository';

@Injectable()
export class GetArticlesUsecase extends Usecase<INewsController['getArticles']> {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly userPublisher: UserPublisher
  ) {
    super()
  }

  public excecute(dto: GetArticlesDto) {
    return super.excecute(dto)
  }

  async handler(dto: GetArticlesDto): Promise<GetArticlesResponse> {
    const { data,...pagination }=await this.articlesRepository.getArticles(dto);
    const userIds=new Set<string>();

    data.forEach((article) => userIds.add(article.authorId));

    const users=await firstValueFrom(this.userPublisher.getUsers({ ids: [...userIds],page: 1,limit: userIds.size }));

    return {
      ...pagination,
      data: data.map((article) => ({
        ...article,
        authorName: users.data.find(({ id }) => id==article.authorId)?.name||''
      }))
    }
  }
}
