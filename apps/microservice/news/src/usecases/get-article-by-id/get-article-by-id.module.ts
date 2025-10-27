import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CacheEntity,CacheModule,UserPublisherModule } from '@test/common';
import { DatabaseModule } from '../../db/database.module';
import { articleCacheConfig } from '../../modules/config/config';
import { GetArticleByIdUsecase } from './get-article-by-id.usecase';

@Module({
  imports: [
    DatabaseModule,
    UserPublisherModule.register(),
    CacheModule.register({
      inject: [articleCacheConfig.KEY],
      useFactory(config: ConfigType<typeof articleCacheConfig>) {
        return {
          ttl: config.ttl,
          entity: CacheEntity.ARTICLE
        }
      }
    }),
  ],
  providers: [GetArticleByIdUsecase],
  exports: [GetArticleByIdUsecase],
})
export class GetArticleByIdModule { }
