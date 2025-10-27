import {
  CanActivate,
  Injectable
} from '@nestjs/common';
import { ContextService,UserPublisher } from '@test/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private ctx: ContextService,
    private readonly usersPublisher: UserPublisher
  ) { }

  async canActivate(): Promise<boolean> {
    try {
      const tokenPayload=await this.ctx.payload;

      if (!tokenPayload) {
        return false;
      }

      // фронт сам определяет время токена и рефрешает до истечения времени
      const now=Math.floor(+new Date()/1000);
      if ((tokenPayload.exp||0)<now) {
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
