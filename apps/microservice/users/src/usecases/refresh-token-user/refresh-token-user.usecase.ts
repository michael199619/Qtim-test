import { Injectable } from '@nestjs/common';
import { AuthService,IUserController,RefreshTokenUserDto,RefreshTokenUserResponse,Usecase } from "@test/common";

@Injectable()
export class RefreshTokenUserUsecase extends Usecase<IUserController['refreshTokenUser']> {
  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  public excecute(dto: RefreshTokenUserDto) {
    return super.excecute(dto);
  }

  public async handler(dto: RefreshTokenUserDto): Promise<RefreshTokenUserResponse> {
    return this.authService.refresh(dto.id,dto.refreshToken);
  }
}
