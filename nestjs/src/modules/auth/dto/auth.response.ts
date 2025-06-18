import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../../models/user';
import { UserResponse } from '../interfaces/auth.userResponseInterface'

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User)
  user: UserResponse;
}