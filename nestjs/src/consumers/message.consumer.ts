import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageQueuePayload } from '../queue/interfaces/queue.interfaces';
import { MessagesService } from 'src/modules/messages/messages.service';

// traitement des messages

@Injectable()
export class MessageConsumer {

  private readonly logger = new Logger(MessageConsumer.name);

  constructor(
      private readonly messagesService: MessagesService,
    ) {}

  @RabbitSubscribe({
    exchange: 'messaging.exchange',
    routingKey: 'message.created',
    queue: 'message.processing',
  })
  async handleMessageCreated(payload: MessageQueuePayload) {
    this.logger.log(`Received message to process from user ${payload.senderId} to conversation ${payload.conversationId}`);
    try {
      const saved = await this.messagesService.handleQueueMessage(payload);
      this.logger.log(`Message ${saved.id} saved successfully`);
    } catch (err){
      this.logger.error(`Failed to save message ${payload.tempId}: ${err.message}`);
    }
  }
}