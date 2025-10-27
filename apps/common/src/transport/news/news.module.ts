import { DynamicModule,Global,Module } from '@nestjs/common';
import { ClientKafka,ClientNats,ClientsModule,Transport } from '@nestjs/microservices';
import { TRANSPORT_NEWS_KAFKA,TRANSPORT_NEWS_NATS,TRASPORT_NEWS_GROUP } from './constants';
import { INewsTransportOptions } from './news.interface';
import { NewsPublisher } from './news.publisher';

@Global()
@Module({})
export class NewsTransportModule {
  static register(
    { useFactory,inject }: { useFactory: (...injects: any) => INewsTransportOptions,inject: any[] }
  ): DynamicModule {
    return {
      module: NewsTransportModule,

      imports: [
        ClientsModule.registerAsync([
          {
            name: TRANSPORT_NEWS_KAFKA,
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
                    groupId: TRASPORT_NEWS_GROUP
                  }
                }
              }
            },
            inject
          },
          {
            name: TRANSPORT_NEWS_NATS,
            useFactory: async (...injects) => {
              const { clientId,natsServers }=await useFactory(...injects);

              return {
                transport: Transport.NATS,
                options: {
                  servers: natsServers,
                  name: clientId,
                  subject: TRASPORT_NEWS_GROUP
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
export class NewsPublisherModule {
  static register(): DynamicModule {

    return {
      module: NewsPublisherModule,

      providers: [
        {
          provide: NewsPublisher,
          useFactory: async (kafkaService: ClientKafka,natsService: ClientNats) => {
            return new NewsPublisher(kafkaService,natsService)
          },
          inject: [TRANSPORT_NEWS_KAFKA,TRANSPORT_NEWS_NATS]
        },
      ],
      exports: [NewsPublisher],
    };
  }
}