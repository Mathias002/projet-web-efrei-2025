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

    @Query(() => [Conversation])
    async userConversations(
        @Args('userId') userId: string,
    ): Promise<Conversation[]> {
        return this.conversationsService.findByUserId(userId)
    }
    
    @Query(() => Conversation, { nullable: true })
    async conversation(
        @Args('id') id: string,
    ): Promise<Conversation | null> {
        return this.conversationsService.findById(id)
    }

    @Mutation(() => Conversation)
    async createConversation(
        @Args('input') input: CreateConversationInput,
        @Args('creatorId') creatorId: string,
    ): Promise<Conversation> {
        return this.conversationsService.create(input, creatorId);
    }

    @ResolveField(() => [Message])
    async messages(@Parent() conversation: Conversation): Promise<Message[]> {
        return this.messagesService.findByConversationId(conversation.id);
    }
}