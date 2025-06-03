import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthResolver } from './health.resolver';
import { QueueModule } from '../../queue/queue.module';
import { MessageConsumer } from '../../consumers/message.consumer';
import { ConversationConsumer } from '../../consumers/conversation.consumer';
import { MessagesModule } from '../../modules/messages/messages.module'

// rassemble les composants

@Module({
  imports: [QueueModule, MessagesModule],
  controllers: [HealthController],
  providers: [
    HealthService, 
    HealthResolver, 
    MessageConsumer, 
    ConversationConsumer
  ],
  exports: [HealthService],
})
export class HealthModule {}