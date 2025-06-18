import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
<<<<<<< HEAD
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
//import { PrismaModule } from '../../prisma/prisma.module'; 
import { PrismaModule } from 'prisma/prisma.module';// Assurez-vous que le chemin est correct
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'SUPER_SECRET', // 🔒 à remplacer par une vraie secret key (env var)
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
=======
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955
