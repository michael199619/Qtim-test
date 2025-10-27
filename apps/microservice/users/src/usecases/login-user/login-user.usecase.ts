import { ForbiddenException,Injectable } from "@nestjs/common";
import { AuthService,IUserController,LoginUserDto,LoginUserResponse,Usecase } from "@test/common";
import { UsersRepository } from "../../db/users/users.repository";

@Injectable()
export class LoginUserUsecase extends Usecase<IUserController['loginUser']> {
    constructor(
        private readonly authService: AuthService,
        private readonly usersRepository: UsersRepository
    ) {
        super()
    }

    public excecute(dto: LoginUserDto) {
        return super.excecute(dto)
    }

    async handler(dto: LoginUserDto): Promise<LoginUserResponse> {
        const user=await this.usersRepository.getUserByLoginOrId(dto.login);

        if (!user) {
            throw new ForbiddenException();
        }

        return await this.authService.login(user.id,dto.password,user.password)
    }
}
