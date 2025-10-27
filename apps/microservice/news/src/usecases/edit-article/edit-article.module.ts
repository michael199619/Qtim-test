import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CacheEntity,CacheModule } from '@test/common';
import { DatabaseModule } from '../../db/database.module';
import { articleCacheConfig } from '../../modules/config/config';
import { EditArticleUsecase } from './edit-article.usecase';

@Module({
  imports: [
    DatabaseModule,
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
  providers: [EditArticleUsecase],
  exports: [EditArticleUsecase],
})
export class EditArticleModule { }
