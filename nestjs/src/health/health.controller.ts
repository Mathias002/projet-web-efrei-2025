// src/health/health.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { HealthService } from './health.service';
import { QueueService } from '../queue/queue.service';
import { MessageQueuePayload } from '../queue/interfaces/queue.interfaces';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly queueService: QueueService,
  ) {}

  @Get()
  getHealth(): string {
    return this.healthService.getHealth();
  }

  @Post('test-queue')
  async testQueue(): Promise<{ message: string; jobId: string }> {
    const testMessage: MessageQueuePayload = {
      id: `test-${Date.now()}`,
      content: 'Test message from health controller',
      senderId: 'user-test',
      conversationId: 'conv-test',
      timestamp: new Date(),
    };

    try {
      await this.queueService.publishMessage(testMessage);
      
      return {
        message: 'Message successfully sent to RabbitMQ queue',
        jobId: testMessage.id,
      };
    } catch (error) {
      throw new Error(`Failed to send message to queue: ${error.message}`);
    }
  }
}