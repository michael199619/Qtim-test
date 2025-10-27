import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
import { TRASPORT_USER_GROUP } from '@test/common';
import { AppModule } from './app.module';
import { SERVICE_ID } from './constants';
import { appConfig,kafkaConfig,natsConfig } from './modules/config/config';

async function bootstrap() {
  const app=await NestFactory.create(AppModule);

  const configApp=app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const configKafka=app.get<ConfigType<typeof kafkaConfig>>(kafkaConfig.KEY);
  const configNats=app.get<ConfigType<typeof natsConfig>>(natsConfig.KEY);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: SERVICE_ID,
        brokers: configKafka.brokers,
      },
      consumer: {
        groupId: TRASPORT_USER_GROUP,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      name: SERVICE_ID,
      servers: configNats.servers
    },
  });

  await app.startAllMicroservices();
  await app.init()

  console.log(`Users microservice is running`);
}
bootstrap();
