import { DynamicModule,Global,Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { getTokenFromBase64 } from "../utils";
import { AUTH_OPTIONS,JWT_ALGORITHM } from "./auth.constants";
import { AuthType,IAuthOptionsApi,IAuthOptionsMicroservice } from "./auth.interface";
import { AuthService } from "./auth.service";

@Global()
@Module({})
export class AuthModule {
    static register(
        { useFactory,inject,imports }: { useFactory: (...injects: any) => IAuthOptionsApi|IAuthOptionsMicroservice,inject?: any[],imports?: any[] }
    ): DynamicModule {
        return {
            module: AuthModule,

            providers: [{
                inject: inject||[],
                provide: AUTH_OPTIONS,
                useFactory(...args: any[]) {
                    return useFactory(...args);
                }
            },AuthService],

            imports: [
                JwtModule.registerAsync({
                    imports: imports||[],
                    inject: inject||[],
                    useFactory: async (...args: any[]) => {
                        const options=useFactory(...args);

                        if (options.type===AuthType.API) {
                            return {
                                secretOrPrivateKey: getTokenFromBase64(options.tokenPublic),
                                signOptions: {
                                    algorithm: JWT_ALGORITHM
                                }
                            }
                        }

                        return {
                            privateKey: getTokenFromBase64(options.tokenPrivate),
                            publicKey: getTokenFromBase64(options.tokenPublic),
                            signOptions: {
                                algorithm: JWT_ALGORITHM
                            }
                        }
                    }
                })
            ],
            exports: [AuthService],
        }
    }
}