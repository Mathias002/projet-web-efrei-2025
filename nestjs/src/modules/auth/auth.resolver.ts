import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
<<<<<<< HEAD
import { SignUpInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
=======
import { LoginInput, RegisterInput } from './dto/auth.input';
import { AuthResponse } from './dto/auth.response';
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

<<<<<<< HEAD
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
=======
  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput.email, loginInput.password);
  }

  @Mutation(() => AuthResponse)
  async register(@Args('input') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(
      registerInput.username,
      registerInput.email,
      registerInput.password,
    );
  }
}
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955
