import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test,TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import { AUTH_OPTIONS } from './auth.constants';
import { ApiType,TokenType } from './auth.interface';
import { AuthService } from './auth.service';

jest.mock('bcrypt',() => ({
    compare: jest.fn().mockImplementation(async (a,b) => a===b),
    hash: jest.fn().mockImplementation(async (s) => `hash_${s}`),
}));

describe('AuthService',() => {
    let service: AuthService;
    let redis: Redis;

    const jwtService=new JwtService({
        secret: 'test_secret_key',
        signOptions: { algorithm: 'HS256' },
    });

    const options={
        accessExpiresIn: '15m',
        refreshExpiresIn: '7d',
        apiType: ApiType.USER,
    };

    beforeAll(async () => {
        redis=new (RedisMock as any)();
        const redisToken='default_IORedisModuleConnectionToken'

        const module: TestingModule=await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: AUTH_OPTIONS,useValue: options },
                { provide: JwtService,useValue: jwtService },
                { provide: redisToken,useValue: redis },
            ],
        })
            .overrideProvider(redisToken)
            .useValue(redis)
            .compile();

        service=module.get<AuthService>(AuthService);
    });

    afterEach(async () => {
        await redis.flushdb();
    });

    afterAll(async () => {
        await redis.quit();
    });

    describe('saveRefreshHash',() => {
        it('should save hashed refresh token with TTL',async () => {
            const userId=randomUUID()
            const exp=Math.floor(Date.now()/1000)+60;
            await service['saveRefreshHash'](userId,'abc','refresh_token',exp);

            const key=`auth:user:refresh:${userId}:abc`;
            const value=await redis.get(key);
            const ttl=await redis.ttl(key);

            expect(value).toBe('hash_refresh_token');
            expect(ttl).toBeGreaterThan(0);
        });
    });

    describe('signTokens',() => {
        it('should create tokens and include jti',async () => {
            const { accessToken,refreshToken,payload }=await (service as any).signTokens('123');
            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
            expect(payload.jti).toBeDefined();
        });
    });

    describe('validateAccess',() => {
        it('should return OK if not revoked and version matches',async () => {
            const userId=randomUUID();
            const jti=randomUUID();
            const result=await service.validateAccess(userId,jti,1);
            expect(result).toBe(TokenType.OK);
        });

        it('should return REVOKED if access is revoked',async () => {
            const userId=randomUUID();
            const jti=randomUUID();
            await redis.set((service as any).accessRevokeKey(userId,jti),'1');
            const result=await service.validateAccess(userId,jti,1);
            expect(result).toBe(TokenType.REVOKED);
        });

        it('should return INVALID_VERSION if session version mismatch',async () => {
            const userId=randomUUID();
            await redis.set((service as any).sessionVersionKey(userId),'5');
            const jti=randomUUID();
            const result=await service.validateAccess(userId,jti,1);
            expect(result).toBe(TokenType.INVALID_VERSION);
        });
    });

    describe('saveRefreshHash',() => {
        it('should save hashed refresh token with TTL',async () => {
            const exp=Math.floor(Date.now()/1000)+60;
            const userId=randomUUID()
            await service['saveRefreshHash'](userId,'abc','refresh_token',exp);

            const key=`auth:user:refresh:${userId}:abc`;
            const value=await redis.get(key);
            const ttl=await redis.ttl(key);

            expect(value).toBe('hash_refresh_token');
            expect(ttl).toBeGreaterThan(0);
        });
    });

    describe('login',() => {
        it('should verify password and return tokens',async () => {
            const userId=randomUUID()
            const result=await service.login(userId,'pass','pass');

            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(result.userId).toBe(userId);

            const keys=await redis.keys('*refresh*');
            expect(keys.length).toBe(1);
        });

        it('should throw ForbiddenException for invalid password',async () => {
            const userId=randomUUID()
            await expect(service.login(userId,'wrong','correct')).rejects.toThrow(ForbiddenException);
        });
    });

    describe('logout',() => {
        it('should revoke access and delete refresh key',async () => {
            const userId=randomUUID()
            const { refreshToken }=await service.login(userId,'pass','pass');

            const refreshKeys=await redis.keys('*refresh*');
            expect(refreshKeys.length).toBe(1);

            await service.logout(userId,refreshToken);

            const afterKeys=await redis.keys('*refresh*');
            const revoked=await redis.keys('*access-revoked*');

            expect(afterKeys.length).toBe(0);
            expect(revoked.length).toBe(1);
        });
    });
});