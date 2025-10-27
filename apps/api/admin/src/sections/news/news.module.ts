import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CacheEntity,CacheModule,NewsPublisherModule,UserPublisherModule } from '@test/common';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { articleCacheConfig } from '../../modules/config/config';
import { NewsController } from './news.controller';

@Module({
  imports: [
    AuthUserModule,
    CacheModule.register({
      inject: [articleCacheConfig.KEY],
      useFactory(config: ConfigType<typeof articleCacheConfig>) {
        return {
          ttl: config.ttl,
          entity: CacheEntity.ARTICLE
        }
      }
    }),
    NewsPublisherModule.register(),
    UserPublisherModule.register(),
  ],
  controllers: [NewsController],
})
export class NewsModule { }