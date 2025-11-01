import { registerAs } from '@nestjs/config';
import { get } from 'env-var';

export const appConfig=registerAs('app',() => ({
    host: get('HOST').default('localhost').asString(),
    port: get('PORT').default('3000').asPortNumber(),
    nodeEnv: get('NODE_ENV').default('development').asString(),
}));

export const redisConfig=registerAs('redis',() => ({
    host: get('REDIS_HOST').default('localhost').asString(),
    port: get('REDIS_PORT').default('6379').asPortNumber(),
    password: get('REDIS_PASSWORD').asString(),
}));

export const databaseConfig=registerAs('database',() => ({
    host: get('NEWS_DB_HOST').default('localhost').asString(),
    port: get('NEWS_DB_PORT').default(5432).asInt(),
    username: get('NEWS_DB_USER').default('postgres').asString(),
    password: get('NEWS_DB_PASSWORD').default('postgres').asString(),
    database: get('NEWS_DB_NAME').default('news').asString(),
}));

export const kafkaConfig=registerAs('kafka',() => ({
    brokers: get('KAFKA_BROKERS').default('localhost:9092').asString().split(','),
    clientId: get('KAFKA_CLIENT_ID').default('test-news').asString(),
    groupId: get('KAFKA_GROUP_ID').default('test-news').asString(),
}));

export const articleCacheConfig=registerAs('articleCache',() => ({
    ttl: get('ARTICLE_CACHE_TTL').default(1000*60*60).asInt(), // hour
}));

export const natsConfig=registerAs('nats',() => ({
    servers: get('NATS_SERVERS').default('nats://localhost:4222').asString().split(','),
}));