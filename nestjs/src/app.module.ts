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
<<<<<<< HEAD
import { PrismaModule } from '../prisma/prisma.module'
//import { AuthModule } from './auth/auth.module';
import { AuthModule } from './modules/auth/auth.module';
=======
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955

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
    HealthModule, 
    QueueModule,
    HealthModule,
    UsersModule,
    AuthModule,
    ConversationsModule,
    MessagesModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}