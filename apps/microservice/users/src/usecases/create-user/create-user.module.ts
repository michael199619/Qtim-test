import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { LoginUserModule } from '../login-user/login-user.module';
import { CreateUserUsecase } from './create-user.usecase';

@Module({
    imports: [DatabaseModule,LoginUserModule,AuthUserModule],
    providers: [CreateUserUsecase],
    exports: [CreateUserUsecase],
})
export class CreateUserModule { }
