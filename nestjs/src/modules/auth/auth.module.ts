import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
