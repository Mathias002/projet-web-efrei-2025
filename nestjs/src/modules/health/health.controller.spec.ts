import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { QueueService } from '../../queue/queue.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            getHealth: jest.fn().mockReturnValue('OK'),
          },
        },
        {
          provide: QueueService,
          useValue: {
            publishMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
    queueService = module.get<QueueService>(QueueService);
  });

  describe('getHealth', () => {
    it('should return health status from HealthService', () => {
      expect(controller.getHealth()).toBe('OK');
      expect(healthService.getHealth).toHaveBeenCalled();
    });
  });

  describe('testQueue', () => {
    it('should send a test message and return success message with jobId', async () => {
      jest.spyOn(queueService, 'publishMessage').mockResolvedValue(undefined);

      const result = await controller.testQueue();

      expect(result.message).toBe('Message successfully sent to RabbitMQ queue');
      expect(result.jobId).toMatch(/^msg-\d+$/);
      expect(queueService.publishMessage).toHaveBeenCalledWith(expect.objectContaining({
        content: 'Test message from health controller',
        senderId: 'user-test',
        conversationId: 'conv-test',
      }));
    });

    it('should throw error if queueService fails', async () => {
      jest.spyOn(queueService, 'publishMessage').mockRejectedValue(new Error('RabbitMQ down'));

      await expect(controller.testQueue()).rejects.toThrow('Failed to send message to queue: RabbitMQ down');
    });
  });
});
