import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiType,AuthModule,AuthType,UserPublisherModule } from '@test/common';
import { jwtConfig } from '../config/config';
import { ConfigurationModule } from '../config/config.module';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        ConfigurationModule,
        AuthModule.register({
            inject: [jwtConfig.KEY],
            useFactory(config: ConfigType<typeof jwtConfig>) {
                return {
                    ...config,
                    type: AuthType.API,
                    apiType: ApiType.USER,
                }
            },

        }),
        UserPublisherModule.register(),
    ],
    providers: [AuthGuard],
    exports: [AuthGuard,AuthModule]
})
export class AuthUserModule { }
