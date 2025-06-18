import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // Mutation GraphQL pour l'inscription d'un utilisateur
  @Mutation(() => String)
  async signUp(@Args('input') input: SignUpInput) {
    // Appelle le service d'authentification pour créer un nouvel utilisateur
    const result = await this.authService.signUp(input);
    // Retourne le token JWT généré après inscription
    return result.token;
  }

  // Mutation GraphQL pour la connexion d'un utilisateur
  @Mutation(() => String)
  async login(@Args('input') input: LoginInput) {
    // Appelle le service d'authentification pour vérifier les identifiants
    const result = await this.authService.login(input);
    // Retourne le token JWT généré après connexion
    return result.token;
  }
}
