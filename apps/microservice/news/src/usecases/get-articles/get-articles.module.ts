import { Module } from '@nestjs/common';
import { UserPublisherModule } from '@test/common';
import { DatabaseModule } from '../../db/database.module';
import { GetArticlesUsecase } from './get-articles.usecase';

@Module({
  imports: [DatabaseModule,UserPublisherModule.register()],
  providers: [GetArticlesUsecase],
  exports: [GetArticlesUsecase],
})
export class GetArticlesModule { }
