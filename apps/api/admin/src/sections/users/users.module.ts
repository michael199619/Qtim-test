import { Module } from '@nestjs/common';
import { UserPublisherModule } from '@test/common';
import { AuthUserModule } from '../../modules/auth/auth.module';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthUserModule,UserPublisherModule.register()],
  controllers: [UsersController],
})
export class UsersModule { }