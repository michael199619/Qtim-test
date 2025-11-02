import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SanitizeModule,UserPublisherModule } from '@test/common';
import { DatabaseModule } from '../../db/database.module';
import { appConfig } from '../../modules/config/config';
import { ConfigurationModule } from '../../modules/config/config.module';
import { CreateArticleUsecase } from './create-article.usecase';

@Module({
  imports: [
    DatabaseModule,
    UserPublisherModule.register(),
    SanitizeModule.register({
      imports: [ConfigurationModule],
      inject: [appConfig.KEY],
      useFactory(config: ConfigType<typeof appConfig>) {
        return {
          imgHostAllowList: [config.host],
          hostName: config.host
        }
      }
    }),
  ],
  providers: [CreateArticleUsecase],
  exports: [CreateArticleUsecase],
})
export class CreateArticleModule { }
