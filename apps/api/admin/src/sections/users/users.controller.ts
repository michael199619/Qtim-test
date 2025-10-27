import { Controller,Get,Query,UseGuards } from '@nestjs/common';
import { ApiOperation,ApiResponse } from '@nestjs/swagger';
import { ContextService,GetUserResponse,GetUsersDto,GetUsersResponse,UserPublisher } from '@test/common';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../../modules/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly ctx: ContextService,
    private readonly usersPublisher: UserPublisher
  ) { }

  @UseGuards(AuthGuard)
  @Get('get-me')
  @ApiOperation({ description: 'getMe operation' })
  @ApiResponse({ type: GetUserResponse })
  getMe(): GetUserResponse {
    return this.ctx.user
  }

  @Get()
  @ApiOperation({ description: 'Получить пользователей' })
  @ApiResponse({ type: GetUsersResponse })
  getUsers(@Query() dto: GetUsersDto) {
    return firstValueFrom(this.usersPublisher.getUsers(dto));
  }
}