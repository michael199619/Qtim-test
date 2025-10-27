import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { RemoveUserUsecase } from './remove-user.usecase';

@Module({
    imports: [DatabaseModule],
    providers: [RemoveUserUsecase],
    exports: [RemoveUserUsecase],
})
export class RemoveUserModule { }
