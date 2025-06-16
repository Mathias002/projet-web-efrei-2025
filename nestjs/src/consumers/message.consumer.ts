// import { Injectable, Logger } from '@nestjs/common';
// import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
// import { MessageQueuePayload } from '../queue/interfaces/queue.interfaces';
// import { MessagesService } from 'src/modules/messages/messages.service';

// // traitement des messages

// @Injectable()
 export class MessageConsumer {
//   private readonly logger = new Logger(MessageConsumer.name);

//   constructor(private readonly messagesService: MessagesService) { }

//   // private messages: MessageQueuePayload[] = []; // Stockage temporaire en mémoire

//   @RabbitSubscribe({
//     exchange: 'messaging.exchange',
//     routingKey: 'message.created',
//     queue: 'message.processing',
//   })
//   async handleMessageCreated(message: MessageQueuePayload) {
//     this.logger.log(`Processing message: ${message.id}`);

//     try {
//       const savedMessage = this.messagesService.saveMessage(message);

//       this.logger.log(`Message ${savedMessage.id} saved succesfully`)
//     } catch (error) {
//       this.logger.error(`Failled to process message ${message.id}: ${error.message}`);
//     }
//   }

//   // private async processMessage(message: MessageQueuePayload): Promise<void> {
//   //   // Simuler un traitement asynchrone
//   //   await new Promise(resolve => setTimeout(resolve, 100));

//   //   // Ici vous ajouterez la logique de sauvegarde en base de données
//   //   // Pour l'instant, on simule juste le traitement
//   //   this.logger.debug(`Message content: ${message.content}`);
//   //   this.logger.debug(`Sender: ${message.senderId}`);
//   //   this.logger.debug(`Conversation: ${message.conversationId}`);
//   // }

//   // // Méthode pour récupérer les messages (pour les tests)
//   // getProcessedMessages(): MessageQueuePayload[] 
//   //   return this.messages;
//   // }
}