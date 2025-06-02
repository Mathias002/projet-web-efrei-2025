export interface MessageQueuePayload {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  timestamp: Date;
}

export interface ConversationQueuePayload {
  id: string;
  participants: string[];
  createdBy: string;
  timestamp: Date;
}