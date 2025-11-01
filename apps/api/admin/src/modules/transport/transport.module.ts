import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NewsTransportModule,UsersTransportModule } from '@test/common';
import { SERVICE_ID } from '../../constants';
import { kafkaConfig,natsConfig } from '../config/config';
import { ConfigurationModule } from '../config/config.module';

@Module({
    imports: [
        ConfigurationModule,
        UsersTransportModule.register({
            useFactory: (configKafka: ConfigType<typeof kafkaConfig>,configNats: ConfigType<typeof natsConfig>) => ({
                kafkaBrokers: configKafka.brokers,
                natsServers: configNats.servers,
                clientId: SERVICE_ID
            }),
            inject: [kafkaConfig.KEY,natsConfig.KEY]
        }),
        NewsTransportModule.register({
            useFactory: (configKafka: ConfigType<typeof kafkaConfig>,configNats: ConfigType<typeof natsConfig>) => ({
                kafkaBrokers: configKafka.brokers,
                natsServers: configNats.servers,
                clientId: SERVICE_ID
            }),
            inject: [kafkaConfig.KEY,natsConfig.KEY]
        }),
    ],
})
export class TransportModule { }
