import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { IAuthOptionsApi } from '@test/common';
import { get } from 'env-var';

export const appConfig=registerAs('app',() => ({
    port: get('PORT').default('3000').asPortNumber(),
    nodeEnv: get('NODE_ENV').default('development').asString(),
    apiPrefix: get('API_PREFIX').default('api').asString()
}));

export const redisConfig=registerAs('redis',() => ({
    host: get('REDIS_HOST').default('localhost').asString(),
    port: get('REDIS_PORT').default('6379').asPortNumber(),
    password: get('REDIS_PASSWORD').asString(),
}));

export const kafkaConfig=registerAs('kafka',() => ({
    brokers: get('KAFKA_BROKERS').default('localhost:9092').asString().split(','),
}));

export const natsConfig=registerAs('nats',() => ({
    servers: get('NATS_SERVERS').default('nats://localhost:4222').asString().split(','),
}));

export const articleCacheConfig=registerAs('articleCache',() => ({
    ttl: get('ARTICLE_CACHE_TTL').default(1000*60*60).asInt(), // hour
}));

export const jwtConfig=registerAs('jwt',() => ({
    refreshExpiresIn: get('JWT_REFRESH_EXPIRES_IN').default('7d').asString() as JwtSignOptions['expiresIn'],
    accessExpiresIn: get('JWT_ACCESS_EXPIRES_IN').default('15m').asString() as JwtSignOptions['expiresIn'],
    tokenPublic: get('JWT_PUBLIC').asString(),
} as IAuthOptionsApi));
