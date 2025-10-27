import { Module } from '@nestjs/common';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { LogoutUserUsecase } from './logout-user.usecase';

@Module({
  imports: [AuthUserModule],
  providers: [LogoutUserUsecase],
  exports: [LogoutUserUsecase],
})
export class LogoutUserModule { }
