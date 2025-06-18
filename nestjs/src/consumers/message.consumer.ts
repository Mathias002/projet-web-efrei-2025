import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageQueuePayload } from '../queue/interfaces/queue.interfaces';
import { MessagesService } from 'src/modules/messages/messages.service';

// Service consommateur qui écoute les messages RabbitMQ et les traite
@Injectable()
export class MessageConsumer {

  // Logger pour suivre les opérations de traitement
  private readonly logger = new Logger(MessageConsumer.name);

  constructor(
      private readonly messagesService: MessagesService,
    ) {}

  // Méthode déclenchée quand un message est publié sur l’échange 'messaging.exchange' avec la clé de routage 'message.created'
  @RabbitSubscribe({
    exchange: 'messaging.exchange',
    routingKey: 'message.created',
    queue: 'message.processing',
  })
  async handleMessageCreated(payload: MessageQueuePayload) {
    // Log la réception du message avec détails expéditeur et conversation
    this.logger.log(`Received message to process from user ${payload.senderId} to conversation ${payload.conversationId}`);
    try {
      // Appel au service pour traiter et sauvegarder le message en base
      const saved = await this.messagesService.handleQueueMessage(payload);
      // Log succès de la sauvegarde
      this.logger.log(`Message ${saved.id} saved successfully`);
    } catch (err){
      // En cas d’erreur, log l’échec avec le message d’erreur
      this.logger.error(`Failed to save message ${payload.tempId}: ${err.message}`);
    }
  }
}
