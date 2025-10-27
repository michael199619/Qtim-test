import { JwtSignOptions } from "@nestjs/jwt";

export const AUTH_OPTIONS=Symbol('AUTH_OPTIONS');
export const JWT_ALGORITHM: JwtSignOptions['algorithm']='RS256';