
// Interface representant la structure du message envoyé à la queue rabittMQ

export interface MessageQueuePayload {
  tempId?: string;
  content: string;
  senderId: string;
  conversationId: string;
  timestamp: Date;
}
