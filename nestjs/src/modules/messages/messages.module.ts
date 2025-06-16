import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { UsersModule } from '../users/user.module';
import { QueueModule } from '../../queue/queue.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [
        UsersModule,
        QueueModule,
        PrismaModule,
        forwardRef(() => ConversationsModule)
    ],
    providers: [MessagesService, MessagesResolver],
    exports: [MessagesService],
})
export class MessagesModule {}