import { DynamicModule,Global,Module } from "@nestjs/common";
import { CACHE_OPTIONS } from "./cache.constants";
import { ICacheOptions } from "./cache.interface";
import { CacheService } from "./cache.service";

@Global()
@Module({})
export class CacheModule {
    static register(
        { useFactory,inject,imports }: { useFactory: (...injects: any) => ICacheOptions,inject?: any[],imports?: any[] }
    ): DynamicModule {
        return {
            module: CacheModule,
            imports,
            providers: [{
                inject: inject||[],
                provide: CACHE_OPTIONS,
                useFactory(...args: any[]) {
                    return useFactory(...args);
                }
            },CacheService],
            exports: [CacheService],
        }
    }
}