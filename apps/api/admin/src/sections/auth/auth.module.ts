import { Module } from '@nestjs/common';
import { UserPublisherModule } from '@test/common';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        AuthUserModule,
        UserPublisherModule.register(),
    ],
    controllers: [AuthController]
})
export class AuthModule { }
