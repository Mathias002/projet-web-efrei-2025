import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageQueuePayload, ConversationQueuePayload } from './interfaces/queue.interfaces';

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
      this.logger.log(`Message published to queue: ${message.id}`);
    } catch (error) {
      this.logger.error(`Failed to publish message: ${error.message}`);
      throw error;
    }
  }

  async publishConversation(conversation: ConversationQueuePayload): Promise<void> {
    try {
      await this.amqpConnection.publish(
        'messaging.exchange',
        'conversation.created',
        conversation,
      );
      this.logger.log(`Conversation published to queue: ${conversation.id}`);
    } catch (error) {
      this.logger.error(`Failed to publish conversation: ${error.message}`);
      throw error;
    }
  }
}