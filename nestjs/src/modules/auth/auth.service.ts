<<<<<<< HEAD
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
=======
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmailOrThrow(email);
    if (user && await bcrypt.compare(password, user.password) && user.deleted == null) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { email: user.email, sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(username: string, email: string, password: string) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userService.findByEmail(email);
    
    if (existingUser) {
      throw new UnauthorizedException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955
