import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageQueuePayload } from './interfaces/queue.interfaces';

// publication dans les queues

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishMessage(message: MessageQueuePayload): Promise<void> {
    try {
      await this.amqpConnection.publish(
        'messaging.exchange',
        'message.created',
        message,
      );
      this.logger.log(`Message published to queue: ${message.tempId}`);
    } catch (error) {
      this.logger.error(`Failed to publish message: ${error.message}`);
      throw error;
    }
  }
}