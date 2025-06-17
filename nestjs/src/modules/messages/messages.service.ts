import { Injectable } from '@nestjs/common';
import { Message } from '../../models/message';
import { SendMessageInput } from './dto/send-message.input';
import { PrismaService } from '../../../prisma/prisma.service';
import { mapToMessage } from './message.mapper';
import { EditMessageInput } from './dto/edit-message.input';

@Injectable()
export class MessagesService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const rawMessages = await this.prisma.message.findMany({
      where: {
        conversationId: conversationId,
        deleted: null
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return rawMessages.map(mapToMessage);
  }

  async findById(id: string): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: { id }
    });

    return message ? mapToMessage(message) : null;
  }

  async send(input: SendMessageInput): Promise<Message> {
    // On vérifie que la conversation existe
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: input.conversationId },
      include: {
        participantLinks: true
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // On vérifie que l'expéditeur existe
    const sender = await this.prisma.user.findUnique({
      where: { id: input.senderId }
    });

    if (!sender) {
      throw new Error('Sender not found');
    }

    // On vérifier que l'expéditeur fait partie de la conversation
    const isParticipant = conversation.participantLinks.some(
      link => link.userId === input.senderId
    );
    
    if (!isParticipant) {
      throw new Error('Sender is not a participant in this conversation');
    }

    // Créer le message
    const createdMessage = await this.prisma.message.create({
      data: {
        content: input.content,
        senderId: input.senderId,
        conversationId: input.conversationId,
      },
    });

    // On Met à jour la conversation avec la date du dernier message
    await this.prisma.conversation.update({
      where: { id: input.conversationId },
      data: {
        lastMessage: createdMessage.createdAt
      }
    });

    return mapToMessage(createdMessage);
  }

  async editMessage(input: EditMessageInput, userId: string): Promise<Message> {

    const message = await this.prisma.message.findUnique({
      where: {
        id: input.messageId
      }
    });

    if(!message) {
      throw new Error('Message not found.');
    }

    if(message.senderId !== userId) {
      throw new Error('Unauthorized to edit this message.')
    }

    const updated = await this.prisma.message.update({
      where: {
        id: input.messageId,
      },
      data: {
        content: input.newContent,
      },
    });

    return mapToMessage(updated);

  }

  async deleteMessage(messageId: string, userId: string) {

    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId
      }
    });

    if(!message) {
      throw new Error('Message not found.');
    }

    if(message.senderId !== userId) { // replace userId by auth 
      throw new Error('Unauthorized to delete this message.')
    }

    const deleted = await this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        deleted: new Date(),
      },
    });

    return mapToMessage(deleted);

  }

}