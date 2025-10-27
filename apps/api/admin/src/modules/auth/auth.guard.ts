import {
  CanActivate,
  Injectable
} from '@nestjs/common';
import { AuthService,ContextService,TokenType,UserPublisher } from '@test/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private ctx: ContextService,
    private auth: AuthService,
    private readonly usersPublisher: UserPublisher
  ) { }

  async canActivate(): Promise<boolean> {
    try {
      const tokenPayload=this.ctx.payload;

      if (!tokenPayload) {
        return false;
      }

      // фронт сам определяет время токена и рефрешает до истечения времени
      const now=Math.floor(+new Date()/1000);
      if ((tokenPayload.exp||0)<now) {
        return false;
      }

      // чек на валидность токена
      const isInvalidToken=await this.auth.validateAccess(tokenPayload.sub,tokenPayload.jti,tokenPayload.sessionVersion);
      if (isInvalidToken!==TokenType.OK) {
        return false;
      }

      const user=await firstValueFrom(
        this.usersPublisher.getUser({
          id: tokenPayload.sub
        }),
      );

      if (!user) {
        return false;
      }

      this.ctx.user=user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
