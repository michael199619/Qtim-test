import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { ChangePasswordUserUsecase } from './change-password-user.usecase';

@Module({
  imports: [AuthUserModule,DatabaseModule],
  providers: [ChangePasswordUserUsecase],
  exports: [ChangePasswordUserUsecase],
})
export class ChangePasswordUserModule { }
