import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChangePasswordUserDto,CreateUserDto,EditUserDto,GetUserDto,GetUsersDto,IUserController,LoginUserDto,LogoutUserDto,RefreshTokenUserDto,RemoveUserDto,UserSubject,UserTopics } from '@test/common';
import { ChangePasswordUserUsecase } from './usecases/change-password-user/change-password-user.usecase';
import { CreateUserUsecase } from './usecases/create-user/create-user.usecase';
import { EditUserUsecase } from './usecases/edit-user/edit-user.usecase';
import { GetUserUsecase } from './usecases/get-user/get-user.usecase';
import { GetUsersUsecase } from "./usecases/get-users/get-users.usecase";
import { LoginUserUsecase } from './usecases/login-user/login-user.usecase';
import { LogoutUserUsecase } from './usecases/logout-user/logout-user.usecase';
import { RefreshTokenUserUsecase } from './usecases/refresh-token-user/refresh-token-user.usecase';
import { RemoveUserUsecase } from './usecases/remove-user/remove-user.usecase';

@Controller()
export class AppController implements IUserController {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly editUserUsecase: EditUserUsecase,
    private readonly removeUserUsecase: RemoveUserUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly loginUserUsecase: LoginUserUsecase,
    private readonly logoutUserUsecase: LogoutUserUsecase,
    private readonly changePasswordUserUsecase: ChangePasswordUserUsecase,
    private readonly refreshTokenUserUsecase: RefreshTokenUserUsecase,
    private readonly getUsersUsecase: GetUsersUsecase
  ) { }

  @MessagePattern(UserTopics.createUser)
  createUser(dto: CreateUserDto) {
    return this.createUserUsecase.excecute(dto)
  }

  @MessagePattern(UserTopics.editUser)
  editUser(dto: EditUserDto) {
    return this.editUserUsecase.excecute(dto)
  }

  @MessagePattern(UserTopics.removeUser)
  removeUser(dto: RemoveUserDto) {
    return this.removeUserUsecase.excecute(dto)
  }

  @MessagePattern(UserSubject.getUser)
  getUser(dto: GetUserDto) {
    return this.getUserUsecase.excecute(dto)
  }

  @MessagePattern(UserSubject.loginUser)
  loginUser(dto: LoginUserDto) {
    return this.loginUserUsecase.excecute(dto)
  }

  @MessagePattern(UserSubject.logoutUser)
  logoutUser(dto: LogoutUserDto) {
    return this.logoutUserUsecase.excecute(dto)
  }

  @MessagePattern(UserSubject.changePasswordUser)
  changePasswordUser(dto: ChangePasswordUserDto) {
    return this.changePasswordUserUsecase.excecute(dto)
  }

  @MessagePattern(UserSubject.refreshTokenUser)
  refreshTokenUser(dto: RefreshTokenUserDto) {
    return this.refreshTokenUserUsecase.excecute(dto)
  }

  @MessagePattern(UserSubject.getUsers)
  getUsers(dto: GetUsersDto) {
    return this.getUsersUsecase.excecute(dto);
  }
} 