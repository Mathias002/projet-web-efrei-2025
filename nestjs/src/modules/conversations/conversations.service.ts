import { Injectable } from '@nestjs/common';
import { Conversation } from '../../models/conversation';
import { UsersService } from '../users/users.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { QueueService } from '../../queue/queue.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mapToConversation } from './conversation.mapper';

@Injectable()
export class ConversationsService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  // Cherche toutes les conversations d’un utilisateur
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

  // Cherche une conversation par son id
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

  // Crée une nouvelle conversation avec un créateur et un participant
  async create(input: CreateConversationInput, creatorId: string) {
    // Vérifie que les utilisateurs existent
    const creator = await this.prisma.user.findUnique({ where: { id: creatorId } });
    const participant = await this.prisma.user.findUnique({ where: { id: input.participantId } });

    if (!creator || !participant) {
      throw new Error('Creator or participant not found');
    }

    // Vérifie s’il existe déjà une conversation entre ces deux utilisateurs
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participantLinks: { some: { userId: creatorId } } },
          { participantLinks: { some: { userId: input.participantId } } },
          // Pour forcer exactement 2 participants, décommenter la partie suivante
          /*
          {
            participantLinks: {
              none: {
                userId: { notIn: [creatorId, input.participantId] }
              }
            }
          }
          */
        ]
      },
      include: {
        participantLinks: { include: { user: true } },
        messages: true,
      },
    });

    if (existing) return mapToConversation(existing);

    // Création de la conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        createdBy: creatorId,
        nom: input.nom,
        createdAt: new Date(),
      },
    });

    // Création du message initial s’il y en a un
    if (input.initialMessage?.trim()) {
      await this.prisma.message.create({
        data: {
          content: input.initialMessage,
          senderId: creatorId,
          conversationId: conversation.id,
        }
      });
    }

    // Ajout des participants à la conversation
    await this.prisma.conversationParticipant.createMany({
      data: [
        { userId: creatorId, conversationId: conversation.id },
        { userId: input.participantId, conversationId: conversation.id },
      ],
    });

    // Récupère la conversation complète avec les participants et messages
    const fullConversation = await this.prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        participantLinks: { include: { user: true } },
        messages: true,
      },
    });

    if (!fullConversation) {
      throw new Error('Failed to load the created conversation.');
    }

    return mapToConversation(fullConversation);
  }
}
