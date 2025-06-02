import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { QueueService } from './queue.service';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'messaging.exchange',
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [QueueService],
  exports: [QueueService, RabbitMQModule],
})
export class QueueModule {}