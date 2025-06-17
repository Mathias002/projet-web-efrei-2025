import { Injectable } from '@nestjs/common';
import { User } from '../../models/user';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { mapUser } from './user.mapper';
import { EditUserInput } from './dto/edit-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { deleted: null },
    });
    return users.map(mapUser);
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('Sorry impossible to find this user.');
    }
    return mapUser(user);
  }

  async findByIds(userIds: string[]) {
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
        deleted: null,
      },
    });

    if (users.length !== userIds.length) {
      throw new Error('Sorry impossible to find some of these users. Please try again.');
    }
    return users.map(mapUser);
  }

  async createUser(input: CreateUserInput) {
    const existing = await this.prisma.user.findFirst({
      where: { email: input.email },
    });
    if (existing) {
      throw new Error('A user with the same email address already exists.');
    }

    // Hashage du mot de passe avant sauvegarde en base
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: hashedPassword, // mot de passe hashé
      },
    });

    return mapUser(createdUser);
  }

  async editUser(userId: string, input: EditUserInput) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new Error('Sorry impossible to find this user.');
    }

    // Vérifie si un autre utilisateur a déjà cet email
    const existingEmail = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        NOT: { id: userId }, // exclut l'utilisateur actuel
      },
    });
    if (existingEmail) {
      throw new Error('A user with the same email address already exists.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: input.username,
        email: input.email,
      },
    });

    return mapUser(updatedUser);
  }

  async deleteUser(userId: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new Error('Sorry impossible to find this user.');
    }

    const deletedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { deleted: new Date() },
    });

    return mapUser(deletedUser);
  }
}
