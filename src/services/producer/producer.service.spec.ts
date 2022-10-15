import { KafkaConfig } from '../../config/kafkaConfig';
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { Producer, ProducerRecord } from 'kafkajs';

describe('ProducerService', () => {
  let service: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: 'KAFKA_CONFIG',
          useValue: new KafkaConfig(),
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should attempt connection on module init', async () => {
    jest.spyOn(service['producer'], 'connect').mockImplementation();

    await service.onModuleInit();
    expect(service['producer'].connect).toHaveBeenCalled();
  });

  it('should disconnect on shutdown', async () => {
    jest.spyOn(service['producer'], 'disconnect').mockImplementation();

    await service.onApplicationShutdown();
    expect(service['producer'].disconnect).toHaveBeenCalled();
  });

  it('should call the send function when a record is called with produce', async () => {
    jest.spyOn(service, 'produce');
    jest.spyOn(service['producer'], 'send').mockImplementation();

    await service.produce({} as unknown as ProducerRecord);
    expect(service['producer'].send).toHaveBeenCalled();
  });
});
