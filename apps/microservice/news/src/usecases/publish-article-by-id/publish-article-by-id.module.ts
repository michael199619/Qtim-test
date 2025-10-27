import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { PublishArticleByIdUsecase } from './publish-article-by-id.usecase';

@Module({
  imports: [DatabaseModule],
  providers: [PublishArticleByIdUsecase],
  exports: [PublishArticleByIdUsecase],
})
export class PublishArticleByIdModule { }
