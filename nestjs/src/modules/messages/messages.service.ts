import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Message } from '../../models/message.model';
import { SendMessageInput } from './dto/send-message.input';
import { ConversationsService } from '../conversations/conversations.service';
import { QueueService } from '../../queue/queue.service';
import { MessageQueuePayload } from '../../queue/interfaces/queue.interfaces';

@Injectable()
export class MessagesService {
  private messages: Message[] = [];

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
    private readonly queueService: QueueService,
  ) { }

  findByConversationId(conversationId: string): Message[] {
    return this.messages
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async send(input: SendMessageInput): Promise<Message> {
    const conversation = this.conversationsService.findById(input.conversationId);
    const sender = this.usersService.findById(input.senderId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (!sender) {
      throw new Error('Sender not found');
    }

    // Vérifier que l'expéditeur fait partie de la conversation
    const isParticipant = conversation.participants.some(p => p.id === input.senderId);
    if (!isParticipant) {
      throw new Error('Sender is not a participant in this conversation');
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: input.content,
      senderId: input.senderId,
      conversationId: input.conversationId,
      createdAt: new Date(),
    };

    // Publier dans la queue au lieu de sauvegarder directement
    const queuePayload: MessageQueuePayload = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      conversationId: message.conversationId,
      timestamp: message.createdAt,
    };

    await this.queueService.publishMessage(queuePayload);

    // Retourner le message immédiatement (réactivité)
    return message;
  }

  saveMessage(messageData: MessageQueuePayload): Message {
    const message: Message = {
      id: messageData.id,
      content: messageData.content,
      senderId: messageData.senderId,
      conversationId: messageData.conversationId,
      createdAt: messageData.timestamp,
    };

    this.messages.push(message);
    return message;
  }

}