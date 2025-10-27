import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './db/database.module';
import { redisConfig } from './modules/config/config';
import { ConfigurationModule } from './modules/config/config.module';
import { TransportModule } from './modules/transport/transport.module';
import { ChangePasswordUserModule } from './usecases/change-password-user/change-password-user.module';
import { CreateUserModule } from './usecases/create-user/create-user.module';
import { EditUserModule } from './usecases/edit-user/edit-user.module';
import { GetUserModule } from './usecases/get-user/get-user.module';
import { GetUsersModule } from "./usecases/get-users/get-users.module";
import { LoginUserModule } from './usecases/login-user/login-user.module';
import { LogoutUserModule } from './usecases/logout-user/logout-user.module';
import { RefreshTokenUserModule } from './usecases/refresh-token-user/refresh-token-user.module';
import { RemoveUserModule } from './usecases/remove-user/remove-user.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    TransportModule,
    RedisModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [redisConfig.KEY],
      useFactory(config: ConfigType<typeof redisConfig>) {
        return {
          type: 'single',
          options: {
            password: config.password,
            host: config.host,
            port: config.port
          }
        }
      },
    }),
    CreateUserModule,
    EditUserModule,
    RemoveUserModule,
    GetUserModule,
    LoginUserModule,
    LogoutUserModule,
    RefreshTokenUserModule,
    ChangePasswordUserModule,
    GetUsersModule
  ],
  controllers: [AppController],
})
export class AppModule { }
