import { ForbiddenException,Injectable } from '@nestjs/common';
import { AuthService,ChangePasswordUserDto,ChangePasswordUserResponse,IUserController,Usecase } from "@test/common";
import { UsersRepository } from '../../db/users/users.repository';

@Injectable()
export class ChangePasswordUserUsecase extends Usecase<IUserController['changePasswordUser']> {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UsersRepository
  ) {
    super();
  }

  public excecute(dto: ChangePasswordUserDto) {
    return super.excecute(dto);
  }

  public async handler(dto: ChangePasswordUserDto): Promise<ChangePasswordUserResponse> {
    const user=await this.userRepository.getUserByLoginOrId(dto.id);

    if (!user||!await this.authService.verifyBcrypt(dto.oldPassword,user.password)) {
      throw new ForbiddenException();
    }

    const hash=await this.authService.getBcryptHashPassword(dto.newPassword);
    await this.userRepository.changePasswordUser(dto.id,hash);

    await this.authService.logoutAll(user.id);

    return await this.authService.login(user.id,dto.newPassword,hash);
  }
}
