import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageQueuePayload } from '../queue/interfaces/queue.interfaces';
import { MessagesService } from 'src/modules/messages/messages.service';

@Injectable()
export class MessageConsumer {

  // Logger pour suivre ce qui se passe dans la console
  private readonly logger = new Logger(MessageConsumer.name);

  constructor(
    private readonly messagesService: MessagesService, // Service pour gérer les messages
  ) {}

  // Ce décorateur permet d'écouter les messages envoyés à RabbitMQ
  @RabbitSubscribe({
    exchange: 'messaging.exchange',      // Nom de l'exchange
    routingKey: 'message.created',       // Clé qui déclenche cette méthode
    queue: 'message.processing',         // Nom de la file à écouter
  })
  async handleMessageCreated(payload: MessageQueuePayload) {
    this.logger.log(`Message reçu : de l'utilisateur ${payload.senderId} vers la conversation ${payload.conversationId}`);

    try {
      // On traite et on enregistre le message
      const saved = await this.messagesService.handleQueueMessage(payload);
      this.logger.log(`Message ${saved.id} enregistré avec succès`);
    } catch (err) {
      // En cas d’erreur, on log le problème avec l'identifiant temporaire
      this.logger.error(`Erreur lors de l'enregistrement du message ${payload.tempId} : ${err.message}`);
    }
  }
}
