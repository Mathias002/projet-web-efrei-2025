import { User as PrismaUser } from '@prisma/client';
import { User } from 'src/models/user';

// Permet la transformation de l'objet PrismaUser en un objet User (graphQL)

export function mapUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    username: prismaUser.username,
    email: prismaUser.email,
    password: prismaUser.password,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    deleted: prismaUser.deleted,
  };
}
