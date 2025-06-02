import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { HealthController } from './modules/health/health.controller';
import { HealthService } from './modules/health/health.service';

@Module({
  imports: [
    // Configuration GraphQL Code First
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Génère le schéma automatiquement
      playground: true, // Interface GraphQL Playground pour tester
      introspection: true, // Permet l'introspection du schéma
    }),
    HealthModule, // Votre module health existant
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}