import { ApiProperty,PickType } from "@nestjs/swagger";
import { PaginationResponse } from "../../../../utils";
import { GetUserResponse } from "../get-user/get-user.response";

class GetUser extends PickType(GetUserResponse,['id','name']) {

}

export class GetUsersResponse extends PaginationResponse<GetUser> {
  @ApiProperty({
    type: GetUser,
    isArray: true,
    description: 'Список пользователей',
  })
  data: GetUser[];
}
