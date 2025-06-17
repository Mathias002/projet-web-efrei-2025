import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

interface SignUpDto {
  email: string;
  username: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private generateToken(userId: string) {
    return this.jwt.sign({ sub: userId });
  }

  async signUp(data: SignUpDto) {
    // Vérifier si un utilisateur existe déjà avec cet email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hash,
      },
    });

    const token = this.generateToken(user.id);

    // Optionnel : ne pas renvoyer le mot de passe dans la réponse
    const { password, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }
}
