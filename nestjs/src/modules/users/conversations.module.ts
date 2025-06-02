import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { UsersModule } from '../users/users.module';
import { QueueModule } from '../../queue/queue.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
    imports: [UsersModule, QueueModule, MessagesModule],
    providers: [ConversationsService, ConversationsResolver],
    exports: [ConversationsService],
})
export class ConversationsModule {}