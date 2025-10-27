import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { redisConfig } from './modules/config/config';
import { ConfigurationModule } from './modules/config/config.module';
import { TransportModule } from './modules/transport/transport.module';
import { CreateArticleModule } from "./usecases/create-article/create-article.module";
import { DeleteArticleModule } from "./usecases/delete-article/delete-article.module";
import { EditArticleModule } from "./usecases/edit-article/edit-article.module";
import { GetArticleByIdModule } from "./usecases/get-article-by-id/get-article-by-id.module";
import { GetArticlesModule } from "./usecases/get-articles/get-articles.module";
import { PublishArticleByIdModule } from "./usecases/publish-article-by-id/publish-article-by-id.module";

@Module({
  imports: [
    ConfigurationModule,
    TransportModule,

    GetArticlesModule,
    GetArticleByIdModule,
    DeleteArticleModule,
    EditArticleModule,
    CreateArticleModule,
    PublishArticleByIdModule,

    RedisModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [redisConfig.KEY],
      useFactory(config: ConfigType<typeof redisConfig>) {
        return {
          type: 'single',
          options: {
            password: config.password,
            host: config.host,
            port: config.port
          }
        }
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule { }
