import { JwtSignOptions } from '@nestjs/jwt';

export enum TokenType {
    OK='ok',
    REVOKED='revoked',
    INVALID_VERSION='invalid_version'
}

export interface RefreshPayload {
    sub: string;
    jti: string;
    iat?: number;
    exp?: number;
    sessionVersion: number;
};

export enum ApiType {
    USER='user',
    CLIENT='client'
}

export enum AuthType {
    API='API',
    MICROSERVICE='MICROSERVICE'
}

export interface AuthOptions {
    apiType: ApiType,
    accessExpiresIn: JwtSignOptions['expiresIn'],
    refreshExpiresIn: JwtSignOptions['expiresIn'],
    tokenPublic: string;
}

export interface IAuthOptionsApi extends AuthOptions {
    type: AuthType.API,
}

export interface IAuthOptionsMicroservice extends AuthOptions {
    type: AuthType.MICROSERVICE,
    tokenPrivate: string;
}
