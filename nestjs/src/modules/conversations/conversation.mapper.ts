import { Conversation as GQLConversation } from '../../models/conversation';
import { Conversation as PrismaConversation, Message, User } from '@prisma/client';

// Permet la transformation de l'objet PrismaConversation en un objet Conversation (graphQL)

export function mapToConversation(prismaConversation: PrismaConversation & {
  participantLinks: { user: User }[];
  messages: Message[];
}): GQLConversation {
  return {
    id: prismaConversation.id,
    // On transforme chaque participant Prisma en modèle GraphQL
    participants: prismaConversation.participantLinks.map(link => ({
      id: link.user.id,
      username: link.user.username,
      email: link.user.email,
      password: link.user.password,
      createdAt: link.user.createdAt,
      updatedAt: link.user.updatedAt,
      deleted: link.user.deleted,
    })),
    // On transforme chaque message Prisma en modèle GraphQL
    messages: prismaConversation.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      conversationId: msg.conversationId,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    })),
    nom: prismaConversation.nom,
    createdBy: prismaConversation.createdBy,
    createdAt: prismaConversation.createdAt,
    lastMessage: prismaConversation.lastMessage ?? undefined, // valeur par défaut si null
  };
}
