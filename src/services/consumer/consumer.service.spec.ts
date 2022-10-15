import { KafkaConfig } from '../../config/kafkaConfig';
import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService } from './consumer.service';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

describe('ConsumerService', () => {
  let service: ConsumerService;
  const mockConsumer = {
    connect: () => {},
    subscribe: () => {},
    run: () => {},
    disconnect: () => {},
  } as unknown as Consumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumerService,
        {
          provide: 'KAFKA_CONFIG',
          useValue: new KafkaConfig(),
        },
      ],
    }).compile();

    service = module.get<ConsumerService>(ConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should push a consumer to the consumer array', async () => {
    jest.spyOn(mockConsumer, 'connect').mockImplementation();
    jest.spyOn(mockConsumer, 'subscribe').mockImplementation();
    jest.spyOn(mockConsumer, 'run').mockImplementation();
    jest.spyOn(service['kafka'], 'consumer').mockReturnValue(mockConsumer);

    expect(service['consumers'].length).toBe(0);

    await service.consume(
      { topics: [] } as ConsumerSubscribeTopics,
      {} as ConsumerRunConfig,
    );
    expect(service['consumers'].length).toBe(1);
  });

  it('Should call disconnect on the consumer in the array on app shutdown', async () => {
    jest.spyOn(mockConsumer, 'disconnect').mockImplementation();
    service['consumers'].push(mockConsumer);

    expect(service['consumers'].length).toBe(1);
    await service.onApplicationShutdown();
    expect(mockConsumer.disconnect).toHaveBeenCalled();
  });
});
