import { Conversation as GQLConversation } from '../../models/conversation';
import { User as GQLUser } from '../../models/user';
import { Message as GQLMessage } from '../../models/message';
import { Conversation as PrismaConversation, Message, User } from '@prisma/client';

export function mapToConversation(prismaConversation: PrismaConversation & {
  participantLinks: { user: User }[];
  messages: Message[];
}): GQLConversation {
  return {
    id: prismaConversation.id,
    participants: prismaConversation.participantLinks.map(link => ({
      id: link.user.id,
      username: link.user.username,
      email: link.user.email,
      createdAt: link.user.createdAt,
    })),
    messages: prismaConversation.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      conversationId: msg.conversationId,
      createdAt: msg.createdAt,
    })),
    createdBy: prismaConversation.createdBy,
    createdAt: prismaConversation.createdAt,
    lastMessage: prismaConversation.lastMessage ?? undefined,
  };
}
