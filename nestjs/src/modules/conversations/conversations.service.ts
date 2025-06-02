import { Injectable } from '@nestjs/common';
import { Conversation } from '../../models/conversation';
import { ConversationQueuePayload } from '../../queue/interfaces/queue.interfaces';
import { UsersService } from '../users/users.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { QueueService } from '../../queue/queue.service'

@Injectable()
export class ConversationsService {
  private conversations: Conversation[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly queueService: QueueService,
  ) { }

  findByUserId(userId: string): Conversation[] {
    return this.conversations
      .filter(conversation => conversation.participants
      .some(participant => participant.id === userId))
  }

  findById(id: string): Conversation | null {
    return this.conversations.find(conversation => conversation.id === id) || null;
  }

  async create(input: CreateConversationInput, creatorId: string): Promise<Conversation> {
    const creator = this.usersService.findById(creatorId);
    const participant = this.usersService.findById(input.participantId);

    if (!creator || !participant) {
      throw new Error('Creator or participant not found.');
    }

    const existingConversation = this.conversations.find(
      conv => conv.participants.length === 2 && conv.participants.some(
        participant => participant.id === creatorId) && conv.participants.some(
          participant => participant.id === input.participantId
        )
    )

    if (existingConversation) {
      return existingConversation;
    }

    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [creator, participant],
      messages: [],
      createdBy: creatorId,
      createdAt: new Date(),
    };

    this.conversations.push(conversation);

    const queuePayload: ConversationQueuePayload = {
      id: conversation.id,
      participants: conversation.participants.map(p => p.id),
      createdBy: conversation.createdBy,
      timestamp: conversation.createdAt,
    };

    await this.queueService.publishConversation(queuePayload);
    return conversation
  }

}