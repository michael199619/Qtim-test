import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { GetUsersUsecase } from './get-users.usecase';

@Module({
  imports: [DatabaseModule],
  providers: [GetUsersUsecase],
  exports: [GetUsersUsecase],
})
export class GetUsersModule { }
