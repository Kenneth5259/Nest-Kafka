import { KafkaConfig } from '../../config/kafkaConfig';
import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  // define the kafka object and producer
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  // inject config service and initialize proder
  constructor(@Inject('KAFKA_CONFIG') kafkaConfig: KafkaConfig) {
    const host = kafkaConfig.broker;
    const port = kafkaConfig.port;
    this.kafka = new Kafka({
      brokers: [`${host}:${port}`],
    });
    this.producer = this.kafka.producer();
  }

  // wait for a successful producer connection
  async onModuleInit() {
    await this.producer.connect();
  }

  // ensure the connection is broken when shutdown
  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  // method to produce a generc record to the configured kafka connection
  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
