import { OmitType } from "@nestjs/swagger";
import { ChangePasswordUserDto } from "@test/common";

export class AdminChangePasswordUserDto extends OmitType(ChangePasswordUserDto,['id']) {

}