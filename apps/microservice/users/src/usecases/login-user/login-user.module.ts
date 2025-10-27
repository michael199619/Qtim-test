import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { LoginUserUsecase } from './login-user.usecase';

@Module({
    imports: [AuthUserModule,DatabaseModule],
    providers: [LoginUserUsecase],
    exports: [LoginUserUsecase],
})
export class LoginUserModule { }
