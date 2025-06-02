import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { HealthController } from './modules/health/health.controller';
import { HealthService } from './modules/health/health.service';
import { QueueModule } from './queue/queue.module';
import { UsersModule } from './modules/users/user.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    // Configuration GraphQL Code First
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Génère le schéma automatiquement
      playground: true, // Interface GraphQL Playground pour tester
      introspection: true, // Permet l'introspection du schéma
      sortSchema: true, // Trie le schéma pour une meilleure lisibilité
    }),
    HealthModule, // Votre module health existant
    QueueModule,
    HealthModule,
    UsersModule,
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}