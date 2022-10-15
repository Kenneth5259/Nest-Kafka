import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KafkaConfig } from './config/kafkaConfig';
import { ConsumerService } from './services/consumer/consumer.service';
import { ProducerService } from './services/producer/producer.service';

@Module({})
export class NestKafkaModule {
  static forRoot(
    broker?: string,
    port?: string,
    groupId?: string,
  ): DynamicModule {
    const kafkaConfig = new KafkaConfig();
    if (broker) {
      kafkaConfig.broker = broker;
    }
    if (port) {
      kafkaConfig.port = port;
    }
    if (groupId) {
      kafkaConfig.groupId = groupId;
    }

    const kafkaProvider: Provider = {
      provide: 'KAFKA_CONFIG',
      useValue: kafkaConfig,
    };
    return {
      module: NestKafkaModule,
      providers: [kafkaProvider, ConsumerService, ProducerService],
      exports: [ConsumerService, ProducerService],
      global: true,
    };
  }
}
