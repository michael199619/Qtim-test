import { DynamicModule,Global,Module } from '@nestjs/common';
import { ClientKafka,ClientNats,ClientsModule,Transport } from '@nestjs/microservices';
import { TRANSPORT_USER_KAFKA,TRANSPORT_USER_NATS,TRASPORT_USER_GROUP } from './constants';
import { IUserTransportOptions } from './users.interface';
import { UserPublisher } from './users.publisher';

@Global()
@Module({})
export class UsersTransportModule {
  static register(
    { useFactory,inject }: { useFactory: (...injects: any) => IUserTransportOptions,inject: any[] }
  ): DynamicModule {
    return {
      module: UsersTransportModule,

      imports: [
        ClientsModule.registerAsync([
          {
            name: TRANSPORT_USER_KAFKA,
            useFactory: async (...injects) => {
              const { clientId,kafkaBrokers }=await useFactory(...injects);

              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId,
                    brokers: kafkaBrokers
                  },
                  consumer: {
                    groupId: TRASPORT_USER_GROUP
                  }
                }
              }
            },
            inject
          },
          {
            name: TRANSPORT_USER_NATS,
            useFactory: async (...injects) => {
              const { clientId,natsServers }=await useFactory(...injects);

              return {
                transport: Transport.NATS,
                options: {
                  servers: natsServers,
                  name: clientId,
                  subject: TRASPORT_USER_GROUP
                }
              }
            },
            inject
          },
        ]),
      ],
      exports: [ClientsModule],
    }
  }
}

@Module({})
export class UserPublisherModule {
  static register(): DynamicModule {

    return {
      module: UserPublisherModule,

      providers: [
        {
          provide: UserPublisher,
          useFactory: async (kafkaService: ClientKafka,natsService: ClientNats) => {
            return new UserPublisher(kafkaService,natsService)
          },
          inject: [TRANSPORT_USER_KAFKA,TRANSPORT_USER_NATS]
        },
      ],
      exports: [UserPublisher],
    };
  }
}