import { ControllerResponse } from "../../utils";
import { ChangePasswordUserDto,ChangePasswordUserResponse,CreateUserDto,CreateUserResponse,EditUserDto,EditUserResponse,GetUserDto,GetUserResponse,GetUsersDto,GetUsersResponse,LoginUserDto,LoginUserResponse,LogoutUserDto,LogoutUserResponse,RefreshTokenUserDto,RefreshTokenUserResponse,RemoveUserDto,RemoveUserResponse } from "./dtos";

export interface IUserTransportOptions {
    clientId: string;
    kafkaBrokers: string[];
    natsServers: string[];
}

export type IUserController={
    createUser(dto: CreateUserDto): ControllerResponse<CreateUserResponse>
    editUser(dto: EditUserDto): ControllerResponse<EditUserResponse>
    getUser(dto: GetUserDto): ControllerResponse<GetUserResponse>
    removeUser(dto: RemoveUserDto): ControllerResponse<RemoveUserResponse>
    changePasswordUser(dto: ChangePasswordUserDto): ControllerResponse<ChangePasswordUserResponse>
    loginUser(dto: LoginUserDto): ControllerResponse<LoginUserResponse>
    logoutUser(dto: LogoutUserDto): ControllerResponse<LogoutUserResponse>
    refreshTokenUser(dto: RefreshTokenUserDto): ControllerResponse<RefreshTokenUserResponse>
    getUsers(dto: GetUsersDto): ControllerResponse<GetUsersResponse>
}