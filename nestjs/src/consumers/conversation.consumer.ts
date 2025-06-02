import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConversationQueuePayload } from '../queue/interfaces/queue.interfaces';

// traitement des conversations

@Injectable()
export class ConversationConsumer {
  private readonly logger = new Logger(ConversationConsumer.name);
  private conversations: ConversationQueuePayload[] = []; // Stockage temporaire

  @RabbitSubscribe({
    exchange: 'messaging.exchange',
    routingKey: 'conversation.created',
    queue: 'conversation.processing',
  })
  async handleConversationCreated(conversation: ConversationQueuePayload) {
    this.logger.log(`Processing conversation: ${conversation.id}`);
    
    try {
      await this.processConversation(conversation);
      this.conversations.push(conversation);
      this.logger.log(`Conversation ${conversation.id} processed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process conversation ${conversation.id}: ${error.message}`);
    }
  }

  private async processConversation(conversation: ConversationQueuePayload): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    this.logger.debug(`Participants: ${conversation.participants.join(', ')}`);
  }

  getProcessedConversations(): ConversationQueuePayload[] {
    return this.conversations;
  }
}