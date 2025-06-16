import { Message as GQLMessage } from '../../models/message';
import { Message as PrismaMessage } from '@prisma/client';

export function mapToMessage(prismaMessage: PrismaMessage): GQLMessage {
  return {
    id: prismaMessage.id,
    content: prismaMessage.content,
    senderId: prismaMessage.senderId,
    conversationId: prismaMessage.conversationId,
    createdAt: prismaMessage.createdAt,
    deleted: prismaMessage.deleted,
    updatedAt: prismaMessage.updatedAt,
  };
}