import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { QueueService } from './queue.service';


// configuration RabbitMQ

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'messaging.exchange',
          type: 'topic',
        },
      ],
      // RABBITMQ_URL -> .env = amqp://user:password@localhost:5672
      uri: process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [QueueService],
  exports: [QueueService, RabbitMQModule],
})
export class QueueModule {}