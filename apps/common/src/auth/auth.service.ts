import { InjectRedis } from '@nestjs-modules/ioredis';
import { ForbiddenException,Inject,Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasher } from '@test/common';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import { AUTH_OPTIONS } from './auth.constants';
import { AuthOptions,RefreshPayload } from './auth.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        @Inject(AUTH_OPTIONS) private readonly options: AuthOptions,
        @InjectRedis() private readonly redis: Redis
    ) {
    }

    private refreshKey(userId: number,jti: string) {
        return `auth:${this.options.apiType}:refresh:${userId}:${jti}`;
    }

    getPayloadFromToken(token: string): Promise<RefreshPayload> {
        return this.jwt.verifyAsync<RefreshPayload>(token);
    }

    public async verify(password: string,hash: string) {
        if (!await PasswordHasher.verify(password,hash)) {
            throw new ForbiddenException();
        }
    }

    private getHashPassword(token: string) {
        return PasswordHasher.getHashPassword(token);
    }

    async login(id: number,password: string,hash: string) {
        await this.verify(password,hash);

        const { accessToken,refreshToken,payload }=await this.signTokens(id);
        await this.saveRefreshHash(id,payload.jti,refreshToken,payload.exp!);
        return { accessToken,refreshToken,userId: id };
    }

    async refresh(userId: number,refreshToken: string) {
        let payload: RefreshPayload;

        try {
            payload=await this.getPayloadFromToken(refreshToken);

            if (payload.sub!==userId) {
                throw new ForbiddenException();
            }
        } catch {
            throw new ForbiddenException();
        }

        const key=this.refreshKey(userId,payload.jti);
        const storedHash=await this.redis.get(key);

        if (!storedHash) {
            throw new ForbiddenException();
        }

        try {
            await this.verify(refreshToken,storedHash)
        } catch (e) {
            await this.redis.del(key);
            throw e
        }

        await this.redis.del(key);

        const {
            accessToken,
            refreshToken: newRefresh,
            payload: newPayload
        }=await this.signTokens(userId);
        await this.saveRefreshHash(userId,newPayload.jti,newRefresh,newPayload.exp!);

        return { accessToken,refreshToken: newRefresh,userId };
    }

    async logout(userId: number,refreshToken: string) {
        try {
            const payload=await this.getPayloadFromToken(refreshToken);

            if (payload.sub!==userId) {
                return;
            };

            await this.redis.del(this.refreshKey(userId,payload.jti));
        } catch {
            // токен мог быть уже невалиден — просто игнорируем
        }
    }

    // todo
    async logoutAll(userId: number) {

    }

    private async signTokens(userId: number) {
        const jti=randomUUID();
        const payload: RefreshPayload={ sub: userId,jti };

        const [accessToken,refreshToken]=await Promise.all([
            this.jwt.signAsync({ sub: userId },{
                expiresIn: this.options.accessExpiresIn,
            }),
            this.jwt.signAsync(payload,{
                expiresIn: this.options.refreshExpiresIn,
            }),
        ]);


        const decoded=this.jwt.decode<RefreshPayload>(refreshToken);
        payload.exp=decoded?.exp;

        return { accessToken,refreshToken,payload };
    }

    private async saveRefreshHash(userId: number,jti: string,token: string,exp: number) {
        const hash=await this.getHashPassword(token)
        const ttlSec=Math.max(1,exp-Math.floor(Date.now()/1000));
        const key=this.refreshKey(userId,jti);
        await this.redis.set(key,hash,'EX',ttlSec);
    }
}