import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { Conversation } from '../../models/conversation';
import { MessagesService } from './messages.service';
import { UsersService } from '../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import { SendMessageInput } from './dto/send-message.input';

@Resolver(() => Message)
export class MessagesResolver {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly conversationsService: ConversationsService,
        private readonly usersService: UsersService,
    ) {}

    @Query(() => [Message])
    conversationMessages(@Args('conversationId') conversationId: string): Message[] {
        return this.messagesService.findByConversationId(conversationId);
    }

    @Mutation(() => Message)
    async sendMessage(@Args('input') input: SendMessageInput): Promise<Message> {
        return this.messagesService.send(input);
    }

    @ResolveField(() => User, { nullable: true })
    sender(@Parent() message: Message): User | null {
        return this.usersService.findById(message.senderId);
    }

    @ResolveField(() => Conversation, { nullable: true })
    conversation(@Parent() message: Message): Conversation | null {
        return this.conversationsService.findById(message.conversationId);
    }
}