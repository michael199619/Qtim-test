import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteArticleResponse {
  @ApiProperty({
    enum: HttpStatus,
    example: HttpStatus.OK
  })
  status: HttpStatus;
}
