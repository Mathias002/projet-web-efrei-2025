import { Injectable } from '@nestjs/common';
import { User } from '../../models/user';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { mapUser } from './user.mapper'
import { EditUserInput } from './dto/edit-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  // permet de récupérer tout les utilisateur de la base de données 
  async findAll() {
    const users = await this.prisma.user.findMany({
      where: {
        deleted: null,
      }
    });

    return users.map(mapUser);
  }

  // permet de récupérer un user via son id
  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('Sorry, impossible to find this user.');
    }

    return user ? mapUser(user) : null;
  }

  // permet de récupérer un user via son email
  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deleted: null,
      },
    });

    // Retourne null si pas trouvé, sans lancer d'erreur
    return user ? mapUser(user) : null;
  }

  // permet de récupérer un user via son email et retourne une exception si il existe déjà
  async findByEmailOrThrow(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Sorry, impossible to find this user.');
    }

    return mapUser(user);
  }

  // permet de récupérer plusieurs user via un tableau d'id (non fonctionnel)
  async findByIds(userIds: string[]) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds
        },
        deleted: null,
      }
    });

    if (users.length != userIds.length) {
      throw new Error('Sorry, impossible to find some of these users. Please try again.');
    }

    return users.map(mapUser); // error return "Cannot return null for non-nullable field User.id."
  }

  // permet de créer un utilisateur en base de données
  async createUser(input: CreateUserInput) {
    const existing = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      }
    });

    console.log(existing);

    if (existing && !existing.deleted) {
      throw new Error('A user with the same email adress already exists.');
    }

    if (existing) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: {
          username: input.username,
          password: input.password,
          deleted: null
        },
      });
    }

    return this.prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: input.password,
      },
    });
  }

  // permet de modifier un utilisateur 
  async editUser(userId: string, input: EditUserInput) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      }
    });

    if (!existingUser) {
      throw new Error('Sorry, impossible to find this user.');
    }

    if (input.email && input.email.trim() !== '') {
      const existingEmail = await this.prisma.user.findFirst({
        where: {
          email: input.email,
          NOT: { id: userId },
        }
      });

      if (existingEmail) {
        throw new Error('A user with the same email adress already exists.');
      }
    }

    const data: Partial<typeof input> = {};

    if (input.username?.trim()) {
      data.username = input.username;
    }

    if (input.email?.trim()) {
      data.email = input.email;
    }

    if (input.password?.trim()) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(input.password, saltRounds);
      data.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: {
        id: userId
      },
      data
    });
  }

  // permet de supprimer un utilisateur 
  async deleteUser(userId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      }
    });

    if (!existingUser) {
      throw new Error('Sorry, impossible to find this user.');
    }

    const deleteUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        deleted: new Date(),
      }
    });

    return mapUser(deleteUser);
  }

}