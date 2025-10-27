import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject,Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CACHE_OPTIONS } from './cache.constants';
import { ICacheOptions } from './cache.interface';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_OPTIONS) private readonly options: ICacheOptions,
    @InjectRedis() private readonly redis: Redis
  ) { }

  async get(id: string|number) {
    const data=await this.redis.get(`${this.options.entity}:${id}`);
    return data? JSON.parse(data):null;
  }

  async set(id: string|number,value: any) {
    await this.redis.set(`${this.options.entity}:${id}`,JSON.stringify(value),'EX',this.options.ttl);
  }

  async invalidate(id: string|number) {
    await this.redis.del(`${this.options.entity}:${id}`);
  }
}