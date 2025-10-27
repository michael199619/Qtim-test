import { JwtSignOptions } from '@nestjs/jwt';

export interface RefreshPayload {
    sub: number;
    jti: string;
    iat?: number;
    exp?: number;
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
