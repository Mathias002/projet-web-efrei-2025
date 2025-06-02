import { Query, Resolver, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class SimpleResponse {
  @Field()
  result: string;
}

@Resolver()
export class AppResolver {
  @Query(() => SimpleResponse)
  getTest(): SimpleResponse {
    return { result: 'ok' };
  }
}
