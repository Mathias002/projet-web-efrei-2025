import { Injectable } from '@nestjs/common';
import { Message } from '../../models/message';
import { SendMessageInput } from './dto/send-message.input';
import { PrismaService } from 'prisma/prisma.service';
import { mapToMessage } from './message.mapper';

@Injectable()
export class MessagesService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const rawMessages = await this.prisma.message.findMany({
      where: {
        conversationId: conversationId
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
}