import { Injectable } from "@nestjs/common";
import { GetUsersDto,GetUsersResponse,IUserController,Usecase } from "@test/common";
import { UsersRepository } from "../../db/users/users.repository";

@Injectable()
export class GetUsersUsecase extends Usecase<IUserController['getUsers']> {
  constructor(
    private readonly userRepository: UsersRepository
  ) {
    super()
  }

  public excecute(dto: GetUsersDto) {
    return super.excecute(dto)
  }

  async handler(dto: GetUsersDto): Promise<GetUsersResponse> {
    return await this.userRepository.getUsers(dto);
  }
}
