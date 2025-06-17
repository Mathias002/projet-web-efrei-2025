import { Injectable } from '@nestjs/common';
import { Conversation } from '../../models/conversation';
import { UsersService } from '../users/users.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { QueueService } from '../../queue/queue.service';
import { PrismaService } from 'prisma/prisma.service';
import { mapToConversation } from './conversation.mapper';

@Injectable()
export class ConversationsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByUserId(userId: string) {
    const rawConversations = await this.prisma.conversation.findMany({
      where: {
        participantLinks: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participantLinks: {
          include: {
            user: true
          }
        },
        messages: true,
      },
    });

    return rawConversations.map(mapToConversation);

  }

  async findById(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participantLinks: {
          include: {
            user: true
          }
        },
        messages: true,
      },
    });

    return conversation ? mapToConversation(conversation) : null;

  }

  async create(input: CreateConversationInput, creatorId: string) {
    const creator = await this.prisma.user.findUnique({where: { id: creatorId } });
    const participant = await this.prisma.user.findUnique({where: { id: input.participantId } });

    if(!creator || !participant) {
      throw new Error('Creator or participant not found');
    }

    // On vérifie si la conversation existe déjà
    const existing = await this.prisma.conversation.findFirst({
      where : {
        participantLinks: {
          every: {
            userId: {
              in: [creatorId, input.participantId],
            },
          },
        },
      },
      include: {
        participantLinks: {
          include: {
            user: true
          }
        },
        messages: true,
      },
    });

    // si la conversation existe déjà on la return
    if(existing) return mapToConversation(existing);
    
    const conversation = await this.prisma.conversation.create({
      data: {
        createdBy: creatorId,
        createdAt: new Date(),
      },
    });

    if(input.initialMessage?.trim()) {
      await this.prisma.message.create({
        data: {
          content: input.initialMessage,
          senderId: creatorId,
          conversationId: conversation.id,
        }
      });
    }

    await this.prisma.conversationParticipant.createMany({
      data: [
        { userId: creatorId, conversationId: conversation.id },
        { userId: input.participantId, conversationId: conversation.id},
      ],
    });

    const fullConversation = await this.prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        participantLinks: {
          include: {
            user: true,
          }
        },
        messages: true,
      },
    });

    if (!fullConversation) {
      throw new Error('Failed to load the created conversation.');
    }

    return mapToConversation(fullConversation);

  }
}