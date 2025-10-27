import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ContextModule } from '@test/common';
import { redisConfig } from './modules/config/config';
import { ConfigurationModule } from './modules/config/config.module';
import { TransportModule } from './modules/transport/transport.module';
import { AuthModule } from './sections/auth/auth.module';
import { NewsModule } from "./sections/news/news.module";
import { UsersModule } from './sections/users/users.module';

@Module({
  imports: [
    ContextModule,
    TransportModule,

    AuthModule,
    UsersModule,
    NewsModule,

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
  ]
})
export class AppModule { }
