import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';
import { HealthService } from './health.service';

// Définition du type GraphQL avec décorateurs
@ObjectType()
export class HealthCheckResponse {
  @Field()
  result: string;

  @Field()
  timestamp: string;

  @Field()
  service: string;
}

@Resolver()
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => HealthCheckResponse)
  async healthCheck(): Promise<HealthCheckResponse> {
    return {
      result: 'ok',
      timestamp: new Date().toISOString(),
      service: 'messaging-api'
    };
  }
}