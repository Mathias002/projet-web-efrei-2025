import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/message';
import { ConversationsService } from './conversations.service';
import { MessagesService } from '../messages/messages.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard'; // Fix this path according to your project structure
import { ClientCredentialsGuard } from 'src/auth/guards/client-credentials.guard'; // Fix this path according to your project structure 

@UseGuards(ClientCredentialsGuard)

@Resolver(() => Conversation)
export class ConversationsResolver {
    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly messagesService: MessagesService,
    ) {}

    @Query(() => [Conversation])
    userConversations(@Args('userId') userId: string): Conversation[] {
        return this.conversationsService.findByUserId(userId);
    }

    @Query(() => Conversation, { nullable: true })
    conversation(@Args('id') id: string): Conversation | null {
        return this.conversationsService.findById(id);
    }
    
    @Mutation(() => Conversation)
    async createConversation(
        @Args('input') input: CreateConversationInput,
        @Args('creatorId') creatorId: string, // Temporaire, plus tard via auth
    ): Promise<Conversation> {
        return this.conversationsService.create(input, creatorId);
    }

    @ResolveField(() => [Message])
    messages(@Parent() conversation: Conversation): Message[] {
        return this.messagesService.findByConversationId(conversation.id);
    }

}