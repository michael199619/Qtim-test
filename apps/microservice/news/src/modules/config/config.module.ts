import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig,articleCacheConfig,databaseConfig,kafkaConfig,natsConfig,redisConfig } from './config';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
            load: [appConfig,redisConfig,kafkaConfig,natsConfig,databaseConfig,articleCacheConfig],
        }),
    ],
})
export class ConfigurationModule { }
