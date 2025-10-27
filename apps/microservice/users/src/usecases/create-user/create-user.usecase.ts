import { BadRequestException,Injectable } from "@nestjs/common";
import { CreateUserDto,CreateUserResponse,IUserController,PasswordHasher,Usecase } from "@test/common";
import { UsersRepository } from "../../db/users/users.repository";
import { LoginUserUsecase } from "../login-user/login-user.usecase";


@Injectable()
export class CreateUserUsecase extends Usecase<IUserController['createUser']> {
    constructor(
        private readonly loginUsecase: LoginUserUsecase,
        private readonly userRepository: UsersRepository,
    ) {
        super()
    }

    public excecute(dto: CreateUserDto) {
        return super.excecute(dto)
    }

    async handler(dto: CreateUserDto): Promise<CreateUserResponse> {
        const user=await this.userRepository.getUserByLoginOrId(dto.login)

        if (user) {
            throw new BadRequestException(`Login have to unique`);
        }

        await this.userRepository.createUser({
            ...dto,
            password: await PasswordHasher.getHashPassword(dto.password)
        });

        return await this.loginUsecase.handler({
            login: dto.login,
            password: dto.password
        })
    }
}
