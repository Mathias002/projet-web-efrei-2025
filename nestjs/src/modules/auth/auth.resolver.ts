import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async signUp(@Args('input') input: SignUpInput) {
    const result = await this.authService.signUp(input);
    return result.token;
  }

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput) {
    const result = await this.authService.login(input);
    return result.token;
  }
}
