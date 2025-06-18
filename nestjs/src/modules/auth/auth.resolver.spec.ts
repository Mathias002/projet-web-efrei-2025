import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';

// Suite de tests pour le resolver d’authentification
describe('AuthResolver', () => {
  let resolver: AuthResolver;

  // Avant chaque test, on crée un module de test NestJS et on récupère une instance du resolver
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver], // On fournit AuthResolver pour l’injection
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver); // On récupère le resolver du module
  });

  // Test simple pour vérifier que le resolver est bien défini
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
