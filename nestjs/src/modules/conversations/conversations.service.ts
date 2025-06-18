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
  ) { }

  /**
   * Récupère toutes les conversations d'un utilisateur via son userId
   * @param userId - identifiant de l'utilisateur
   * @returns liste des conversations mappées
   */
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

    // Transformation des données brutes vers le modèle Conversation
    return rawConversations.map(mapToConversation);
  }

  /**
   * Récupère une conversation par son identifiant
   * @param id - identifiant de la conversation
   * @returns conversation ou null si non trouvée
   */
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

  /**
   * Crée une nouvelle conversation entre le créateur et un participant,
   * avec un message initial optionnel.
   * @param input - données pour créer la conversation (participantId, initialMessage)
   * @param creatorId - identifiant du créateur de la conversation
   * @returns la conversation créée ou existante
   */
  async create(input: CreateConversationInput, creatorId: string) {
<<<<<<< HEAD
    // Vérification que le créateur et le participant existent bien
    const creator = await this.prisma.user.findUnique({where: { id: creatorId } });
    const participant = await this.prisma.user.findUnique({where: { id: input.participantId } });
=======
    const creator = await this.prisma.user.findUnique({ where: { id: creatorId } });
    const participant = await this.prisma.user.findUnique({ where: { id: input.participantId } });
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955

    if (!creator || !participant) {
      throw new Error('Creator or participant not found');
    }

<<<<<<< HEAD
    // Vérifie si une conversation entre ces deux utilisateurs existe déjà
=======
    // On vérifie si la conversation existe déjà entre ces deux utilisateurs spécifiques
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          // La conversation doit avoir exactement ces deux participants
          {
            participantLinks: {
              some: {
                userId: creatorId
              }
            }
          },
          {
            participantLinks: {
              some: {
                userId: input.participantId
              }
            }
          },
          // Optionnel : s'assurer qu'il n'y a que 2 participants au total
          // Décommentez les lignes suivantes si vous voulez cette contrainte
          /*
          {
            participantLinks: {
              none: {
                userId: {
                  notIn: [creatorId, input.participantId]
                }
              }
            }
          }
          */
        ]
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

<<<<<<< HEAD
    // Si elle existe déjà, retourne cette conversation
    if(existing) return mapToConversation(existing);
    
    // Création d'une nouvelle conversation
=======
    // si la conversation existe déjà on la return
    if (existing) return mapToConversation(existing);

>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955
    const conversation = await this.prisma.conversation.create({
      data: {
        createdBy: creatorId,
        nom: input.nom,
        createdAt: new Date(),
      },
    });

<<<<<<< HEAD
    // Si un message initial est présent et non vide, on le crée
    if(input.initialMessage?.trim()) {
=======
    if (input.initialMessage?.trim()) {
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955
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

    // Rechargement de la conversation complète avec les relations
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
