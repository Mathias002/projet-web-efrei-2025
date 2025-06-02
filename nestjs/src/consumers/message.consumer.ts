import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageQueuePayload } from '../queue/interfaces/queue.interfaces';

@Injectable()
export class MessageConsumer {
  private readonly logger = new Logger(MessageConsumer.name);
  private messages: MessageQueuePayload[] = []; // Stockage temporaire en mémoire

  @RabbitSubscribe({
    exchange: 'messaging.exchange',
    routingKey: 'message.created',
    queue: 'message.processing',
  })
  async handleMessageCreated(message: MessageQueuePayload) {
    this.logger.log(`Processing message: ${message.id}`);
    
    try {
      // Simuler un traitement (validation, sauvegarde, etc.)
      await this.processMessage(message);
      
      // Stocker en mémoire pour l'instant
      this.messages.push(message);
      
      this.logger.log(`Message ${message.id} processed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process message ${message.id}: ${error.message}`);
      // Ici vous pourrez implémenter une logique de retry plus tard
    }
  }

  private async processMessage(message: MessageQueuePayload): Promise<void> {
    // Simuler un traitement asynchrone
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Ici vous ajouterez la logique de sauvegarde en base de données
    // Pour l'instant, on simule juste le traitement
    this.logger.debug(`Message content: ${message.content}`);
    this.logger.debug(`Sender: ${message.senderId}`);
    this.logger.debug(`Conversation: ${message.conversationId}`);
  }

  // Méthode pour récupérer les messages (pour les tests)
  getProcessedMessages(): MessageQueuePayload[] {
    return this.messages;
  }
}