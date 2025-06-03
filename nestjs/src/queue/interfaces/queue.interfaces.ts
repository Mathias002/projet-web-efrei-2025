
// les payloads

export interface MessageQueuePayload {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  timestamp: number;
}

export interface ConversationQueuePayload {
  id: string;
  participants: string[];
  createdBy: string;
  timestamp: Date;
}