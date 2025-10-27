import { Module } from '@nestjs/common';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { RefreshTokenUserUsecase } from './refresh-token-user.usecase';

@Module({
  imports: [AuthUserModule],
  providers: [RefreshTokenUserUsecase],
  exports: [RefreshTokenUserUsecase],
})
export class RefreshTokenUserModule { }
