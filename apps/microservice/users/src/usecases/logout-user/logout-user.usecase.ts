import { HttpStatus,Injectable } from '@nestjs/common';
import { AuthService,IUserController,LogoutUserDto,LogoutUserResponse,Usecase } from "@test/common";

@Injectable()
export class LogoutUserUsecase extends Usecase<IUserController['logoutUser']> {
  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  public excecute(dto: LogoutUserDto) {
    return super.excecute(dto);
  }

  public async handler(dto: LogoutUserDto): Promise<LogoutUserResponse> {
    await this.authService.logout(dto.id,dto.refreshToken);

    return {
      status: HttpStatus.OK
    }
  }
}
