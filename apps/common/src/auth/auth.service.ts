import { InjectRedis } from '@nestjs-modules/ioredis';
import { ForbiddenException,Inject,Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasher } from '@test/common';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import { AUTH_OPTIONS } from './auth.constants';
import { AuthOptions,RefreshPayload,TokenType } from './auth.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        @Inject(AUTH_OPTIONS) private readonly options: AuthOptions,
        @InjectRedis() private readonly redis: Redis
    ) { }

    private refreshKey(userId: number,jti: string) {
        return `auth:${this.options.apiType}:refresh:${userId}:${jti}`;
    }

    private accessRevokeKey(userId: number,jti: string) {
        return `auth:${this.options.apiType}:access-revoked:${userId}:${jti}`;
    }

    private sessionVersionKey(userId: number) {
        return `auth:${this.options.apiType}:session-version:${userId}`;
    }

    private async getSessionVersion(userId: number): Promise<number> {
        const version=await this.redis.get(this.sessionVersionKey(userId));
        return version? Number(version):1;
    }

    private getHashPassword(token: string) {
        return PasswordHasher.getHashPassword(token);
    }

    private async saveRefreshHash(userId: number,jti: string,token: string,exp: number) {
        const hash=await this.getHashPassword(token);
        const ttlSec=Math.max(1,exp-Math.floor(Date.now()/1000));
        const key=this.refreshKey(userId,jti);
        await this.redis.set(key,hash,'EX',ttlSec);
    }

    private async verify(password: string,hash: string) {
        if (!await PasswordHasher.verify(password,hash)) {
            throw new ForbiddenException();
        }
    }

    verifyJwtToken(token: string) {
        return this.jwt.verifyAsync<RefreshPayload>(token);
    }

    async login(userId: number,password: string,hash: string) {
        await this.verify(password,hash);
        const { accessToken,refreshToken,payload: { jti,exp } }=await this.signTokens(userId);

        await this.saveRefreshHash(userId,jti,refreshToken,exp!);
        return { accessToken,refreshToken,userId };
    }

    async refresh(userId: number,refreshToken: string) {
        let payload: RefreshPayload;

        try {
            payload=await this.jwt.verifyAsync<RefreshPayload>(refreshToken);

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
            await this.verify(refreshToken,storedHash);
        } catch (e) {
            await this.redis.del(key);
            throw e;
        }

        await this.redis.del(key);

        const { payload: { jti,exp },...tokens }=await this.signTokens(userId);
        await this.saveRefreshHash(userId,jti,tokens.refreshToken,exp!);

        return { ...tokens,userId };
    }

    async logout(userId: number,refreshToken: string) {
        try {
            const { sub,jti,exp }=await this.verifyJwtToken(refreshToken);
            const ttlSec=Math.max(1,exp!-Math.floor(Date.now()/1000));

            if (sub!==userId) {
                return;
            }

            await this.redis.del(this.refreshKey(userId,jti));

            const key=this.accessRevokeKey(userId,jti);
            await this.redis.set(key,'1','EX',ttlSec);
        } catch (e) {
            console.error(e)
        }
    }

    async logoutAll(userId: number) {
        const pattern=this.refreshKey(userId,'*');

        const keys=await this.redis.keys(pattern);
        if (keys.length) {
            await this.redis.del(...keys);
        }

        const newVersion=await this.redis.incr(this.sessionVersionKey(userId));
        await this.redis.persist(this.sessionVersionKey(userId));

        return newVersion;
    }

    async validateAccess(userId: number,jti: string,sessionVersion: number|undefined) {
        const script=`
            local revoked = redis.call("GET", KEYS[1])
            local version = redis.call("GET", KEYS[2])
        
            if revoked then
                return "${TokenType.REVOKED}"
            end
        
            local currentVersion = tonumber(version) or 1
            local argVersion = tonumber(ARGV[1]) or 1
        
            if currentVersion ~= argVersion then
                return "${TokenType.INVALID_VERSION}"
            end
        
            return "${TokenType.OK}"
        `;

        const result=await this.redis.eval(
            script,
            2,
            this.accessRevokeKey(userId,jti),
            this.sessionVersionKey(userId),
            sessionVersion??0
        );

        return result as TokenType;
    }

    private async signTokens(userId: number) {
        const jti=randomUUID();
        const sessionVersion=await this.getSessionVersion(userId);
        const payload: RefreshPayload={ sub: userId,jti,sessionVersion };

        const [accessToken,refreshToken]=await Promise.all([
            this.jwt.signAsync(payload,{
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
}