import { Injectable,NotFoundException,Scope } from '@nestjs/common';
import { GetUserResponse,LoginUserResponse,RefreshPayload } from '@test/common';
import { Request,Response } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private _user?: GetUserResponse;
  private _payload?: RefreshPayload;
  public res: Response;
  public req: Request;

  get user() {
    if (!this._user) {
      throw new NotFoundException();
    }

    return this._user;
  }

  get payload() {
    return this._payload;
  }

  get userId() {
    if (!this._payload) {
      throw new NotFoundException();
    }

    return +this._payload.sub
  }

  set user(session: GetUserResponse) {
    this._user=session;
  }

  set payload(payload: RefreshPayload|undefined) {
    this._payload=payload;
  }

  setTokens({ accessToken,refreshToken,userId }: LoginUserResponse) {
    this.res.cookie('access_token',accessToken);
    this.res.cookie('refresh_token',refreshToken);
    this.res.cookie('user_id',userId);
  }

  removeTokens() {
    this.res.clearCookie('access_token');
    this.res.clearCookie('refresh_token');
    this.res.clearCookie('user_id');
  }

  get accessToken() {
    return this.req.cookies?.['access_token']
  }

  get refreshToken() {
    return this.req.cookies?.['refresh_token']
  }
}
