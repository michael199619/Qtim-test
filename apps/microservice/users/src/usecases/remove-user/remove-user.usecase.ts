import { HttpStatus,Injectable,NotFoundException } from "@nestjs/common";
import { IUserController,RemoveUserDto,RemoveUserResponse,Usecase } from "@test/common";
import { UsersRepository } from "../../db/users/users.repository";

@Injectable()
export class RemoveUserUsecase extends Usecase<IUserController['removeUser']> {
    constructor(
        private readonly userRepository: UsersRepository
    ) {
        super()
    }

    public excecute(dto: RemoveUserDto) {
        return super.excecute(dto)
    }

    async handler(dto: RemoveUserDto): Promise<RemoveUserResponse> {
        if (!await this.userRepository.getUserById(dto.id)) {
            throw new NotFoundException('user is not exists')
        }

        await this.userRepository.removeUserById(dto.id);

        return {
            status: HttpStatus.OK
        }
    }
} 
