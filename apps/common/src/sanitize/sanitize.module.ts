import { DynamicModule,Module } from "@nestjs/common";
import { SANITIZE_OPTIONS } from "./constants";
import { ISanitizeOptions } from "./sanitize.interface";
import { SanitizeService } from "./sanitize.service";

@Module({})
export class SanitizeModule {
    static register(
        { useFactory,inject,imports }: { useFactory: (...injects: any) => ISanitizeOptions,inject?: any[],imports?: any[] }
    ): DynamicModule {
        return {
            module: SanitizeModule,
            imports,
            providers: [{
                inject: inject||[],
                provide: SANITIZE_OPTIONS,
                useFactory(...args: any[]) {
                    return useFactory(...args);
                }
            },SanitizeService],
            exports: [SanitizeService],
        }
    }
}