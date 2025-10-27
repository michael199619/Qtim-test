import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CacheEntity,CacheModule } from '@test/common';
import { DatabaseModule } from '../../db/database.module';
import { articleCacheConfig } from '../../modules/config/config';
import { DeleteArticleUsecase } from './delete-article.usecase';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register({
      inject: [articleCacheConfig.KEY],
      useFactory(config: ConfigType<typeof articleCacheConfig>) {
        return {
          ttl: 500,
          entity: CacheEntity.ARTICLE
        }
      }
    }),
  ],
  providers: [DeleteArticleUsecase],
  exports: [DeleteArticleUsecase],
})
export class DeleteArticleModule { }
