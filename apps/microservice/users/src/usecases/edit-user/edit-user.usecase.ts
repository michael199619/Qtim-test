import { HttpStatus,Injectable,NotFoundException } from "@nestjs/common";
import { EditUserDto,EditUserResponse,IUserController,Usecase } from "@test/common";
import { UsersRepository } from "../../db/users/users.repository";

@Injectable()
export class EditUserUsecase extends Usecase<IUserController['editUser']> {
    constructor(
        private readonly userRepository: UsersRepository
    ) {
        super()
    }

    public excecute(dto: EditUserDto) {
        return super.excecute(dto)
    }

    async handler(dto: EditUserDto): Promise<EditUserResponse> {
        if (!await this.userRepository.getUserById(dto.id)) {
            throw new NotFoundException('user is not exists')
        }

        await this.userRepository.editUser(dto);

        return {
            status: HttpStatus.OK
        }
    }
}
