import { Module, forwardRef } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { UsersModule } from '../users/user.module';
import { QueueModule } from '../../queue/queue.module';
import { MessagesModule } from '../messages/messages.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [
        UsersModule, 
        QueueModule, 
        PrismaModule,
        forwardRef(() => MessagesModule)
    ],
    providers: [ConversationsService, ConversationsResolver],
    exports: [ConversationsService],
})
export class ConversationsModule {}