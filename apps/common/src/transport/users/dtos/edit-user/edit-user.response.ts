import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class EditUserResponse {
    @ApiProperty({
        enum: HttpStatus,
        description: 'Статус',
        example: HttpStatus.OK
    })
    status: HttpStatus;
}