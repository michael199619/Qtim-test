import { ClientKafka,ClientNats } from "@nestjs/microservices";
import { UserSubject,UserTopics,userTopics } from "./constants";
import { ChangePasswordUserDto,ChangePasswordUserResponse,CreateUserDto,CreateUserResponse,EditUserDto,EditUserResponse,GetUserDto,GetUserResponse,GetUsersDto,GetUsersResponse,LoginUserDto,LoginUserResponse,LogoutUserDto,LogoutUserResponse,RefreshTokenUserDto,RefreshTokenUserResponse,RemoveUserDto,RemoveUserResponse } from "./dtos";
import { IUserController } from "./users.interface";

export class UserPublisher implements IUserController {
    constructor(
        private kafkaService: ClientKafka,
        private natsService: ClientNats
    ) {
    }

    private async onApplicationBootstrap() {
        userTopics.forEach(pattern => this.kafkaService.subscribeToResponseOf(pattern))
        await this.kafkaService.connect()
    }

    createUser(dto: CreateUserDto) {
        return this.natsService.send<CreateUserResponse>(UserTopics.createUser,dto)
    }

    editUser(dto: EditUserDto) {
        return this.natsService.send<EditUserResponse>(UserTopics.editUser,dto)
    }

    getUser(dto: GetUserDto) {
        return this.natsService.send<GetUserResponse>(UserSubject.getUser,dto)
    }

    removeUser(dto: RemoveUserDto) {
        return this.kafkaService.send<RemoveUserResponse>(UserTopics.removeUser,dto)
    }

    changePasswordUser(dto: ChangePasswordUserDto) {
        return this.natsService.send<ChangePasswordUserResponse>(UserSubject.changePasswordUser,dto)
    }

    loginUser(dto: LoginUserDto) {
        return this.natsService.send<LoginUserResponse>(UserSubject.loginUser,dto)
    }

    logoutUser(dto: LogoutUserDto) {
        return this.natsService.send<LogoutUserResponse>(UserSubject.logoutUser,dto)
    }

    refreshTokenUser(dto: RefreshTokenUserDto) {
        return this.natsService.send<RefreshTokenUserResponse>(UserSubject.refreshTokenUser,dto)
    }

    getUsers(dto: GetUsersDto) {
        return this.natsService.send<GetUsersResponse>(UserSubject.getUsers,dto)
    }
}