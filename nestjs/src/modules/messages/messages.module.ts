import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { UsersModule } from '../users/user.module';
import { QueueModule } from '../../queue/queue.module';
import { ConversationsModule } from '../conversations/conversations.module';

@Module({
    imports: [
        UsersModule,
        QueueModule,
        forwardRef(() => ConversationsModule)
    ],
    providers: [MessagesService, MessagesResolver],
    exports: [MessagesService],
})

export class MessagesModule {}