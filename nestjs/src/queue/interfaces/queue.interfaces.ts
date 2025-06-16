
// les payloads

export interface MessageQueuePayload {
  tempId?: string;
  content: string;
  senderId: string;
  conversationId: string;
  timestamp: Date;
}
