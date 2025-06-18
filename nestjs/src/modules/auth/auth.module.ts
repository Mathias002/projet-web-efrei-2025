import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    UsersModule, // On importe le module user pour gérer les données liées aux utilisateurs
    PassportModule, // Permet d’utiliser les stratégies d’authentification
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Clé secrète pour signer les tokens
      signOptions: { expiresIn: '24h' }, // Durée de validité du token
    }),
  ],
  providers: [
    AuthService, // Contient la logique d’authentification
    AuthResolver, // Pour gérer l’authentification côté GraphQL
    JwtStrategy, // Stratégie JWT utilisée par Passport
  ],
  exports: [AuthService], // On rend AuthService dispo pour les autres modules
})
export class AuthModule {}
