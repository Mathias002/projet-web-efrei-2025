import { Injectable } from '@nestjs/common';
import { User } from '../../models/user';
import { PrismaService } from 'prisma/prisma.service'; 
import { CreateUserInput } from './dto/create-user.input';
import { mapUser } from './user.mapper'

@Injectable()
export class UsersService {
constructor(
  private readonly prisma: PrismaService,
) {}
  
  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map(mapUser);
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { 
        id: userId 
      },  
    });

     return user ? mapUser(user) : null;
  }

  async findByIds(userIds: string[]) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds 
        }
      }
    });

    return users.map(mapUser);

  }

  async createUser(input: CreateUserInput) {
    const existing = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      }
    });

    if(existing) {
      throw new Error('A user with the same email adress already exist.');
    }

    const createdUser = await this.prisma.user.create({
      data: {
        username: input.username,
        email: input.email
      },
    });

    return mapUser(createdUser) ;

  }
}