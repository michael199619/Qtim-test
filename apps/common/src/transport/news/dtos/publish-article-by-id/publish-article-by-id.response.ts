import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class PublishArticleByIdResponse {
  @ApiProperty({
    enum: HttpStatus,
    description: 'Статус',
    example: HttpStatus.OK
  })
  status: HttpStatus;

}
