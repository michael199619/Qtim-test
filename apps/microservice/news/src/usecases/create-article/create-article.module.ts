import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { CreateArticleUsecase } from './create-article.usecase';

@Module({
  imports: [DatabaseModule],
  providers: [CreateArticleUsecase],
  exports: [CreateArticleUsecase],
})
export class CreateArticleModule { }
