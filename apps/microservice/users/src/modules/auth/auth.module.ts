import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiType,AuthModule,AuthType } from '@test/common';
import { jwtConfig } from '../config/config';
import { ConfigurationModule } from '../config/config.module';

@Module({
    imports: [
        ConfigurationModule,
        AuthModule.register({
            inject: [jwtConfig.KEY],
            useFactory(config: ConfigType<typeof jwtConfig>) {
                return {
                    ...config,
                    type: AuthType.MICROSERVICE,
                    apiType: ApiType.USER,
                }
            }
        }),
    ],
    exports: [AuthModule]
})
export class AuthUserModule { }
