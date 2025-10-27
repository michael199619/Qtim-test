import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { EditUserUsecase } from './edit-user.usecase';

@Module({
    imports: [DatabaseModule],
    providers: [EditUserUsecase],
    exports: [EditUserUsecase],
})
export class EditUserModule { }
