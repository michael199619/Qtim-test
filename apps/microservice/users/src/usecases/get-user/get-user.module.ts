import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { GetUserUsecase } from './get-user.usecase';

@Module({
    imports: [DatabaseModule],
    providers: [GetUserUsecase],
    exports: [GetUserUsecase],
})
export class GetUserModule { }
