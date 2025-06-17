import { Injectable } from '@nestjs/common';
import { User } from '../../models/user';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { mapUser } from './user.mapper'
import { EditUserInput } from './dto/edit-user.input';
import { LoginInput } from '../login/login.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: {
        deleted: null,
      }
    });

    return users.map(mapUser);
  }

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

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('Sorry, impossible to find this user.');
    }

    return user ? mapUser(user) : null;
  }

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

    // console.log(users);

    return users.map(mapUser); // error return "Cannot return null for non-nullable field User.id."
  }

  async createUser(input: CreateUserInput) {
    const existing = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      }
    });

    if (existing) {
      throw new Error('A user with the same email adress already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(input.password, saltRounds);

    return this.prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: hashedPassword,
      }, });
  }

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

  async loginUser(input: LoginInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) return null;

    const { password, ...rest } = user;
    return rest as User;
  }

}