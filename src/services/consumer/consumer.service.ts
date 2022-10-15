import { KafkaConfig } from '../../config/kafkaConfig';
import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  // define the kafka object and consumer array
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];
  private groupId: string;

  // inject config service and initialize Kafka object
  constructor(@Inject('KAFKA_CONFIG') kafkaConfig: KafkaConfig) {
    const host = kafkaConfig.broker;
    const port = kafkaConfig.port;
    this.groupId = kafkaConfig.groupId;
    this.kafka = new Kafka({
      brokers: [`${host}:${port}`],
    });
  }

  // creats a new consumer with the configured group ID
  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: this.groupId });

    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  // disconnect each consumer on app shutdown
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
