import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/message';
import { ConversationsService } from './conversations.service';
import { MessagesService } from '../messages/messages.service';
import { CreateConversationInput } from './dto/create-conversation.input';

@Resolver(() => Conversation)
export class ConversationsResolver {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  // Récupère toutes les conversations d’un utilisateur via son id
  @Query(() => [Conversation])
  async userConversations(@Args('userId') userId: string): Promise<Conversation[]> {
    return this.conversationsService.findByUserId(userId);
  }

  // Récupère une conversation via son id
  @Query(() => Conversation, { nullable: true })
  async conversation(@Args('id') id: string): Promise<Conversation | null> {
    return this.conversationsService.findById(id);
  }

  // Crée une nouvelle conversation entre deux utilisateurs
  @Mutation(() => Conversation)
  async createConversation(
    @Args('input') input: CreateConversationInput,
    @Args('creatorId') creatorId: string,
  ): Promise<Conversation> {
    return this.conversationsService.create(input, creatorId);
  }

  // Récupère les messages d’une conversation
  @ResolveField(() => [Message])
  async messages(@Parent() conversation: Conversation): Promise<Message[]> {
    return this.messagesService.findByConversationId(conversation.id);
  }
}
