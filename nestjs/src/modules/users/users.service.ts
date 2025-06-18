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

  /**
   * Récupère tous les utilisateurs non supprimés (deleted = null)
   * @returns liste des utilisateurs mappés
   */
  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { deleted: null },
    });
    return users.map(mapUser);
  }

  /**
   * Trouve un utilisateur par son identifiant
   * @param userId - identifiant de l'utilisateur
   * @throws erreur si utilisateur non trouvé
   * @returns utilisateur mappé
   */
  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('Sorry impossible to find this user.');
    }
    return mapUser(user);
  }

  /**
   * Trouve plusieurs utilisateurs par leurs identifiants
   * @param userIds - liste des identifiants utilisateurs
   * @throws erreur si certains utilisateurs ne sont pas trouvés
   * @returns liste des utilisateurs mappés
   */
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

  /**
   * Crée un nouvel utilisateur avec mot de passe hashé
   * @param input - données nécessaires (username, email, password)
   * @throws erreur si email déjà existant
   * @returns utilisateur créé mappé
   */
  async createUser(input: CreateUserInput) {
    // Vérifie qu'aucun utilisateur avec cet email n'existe déjà
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

  /**
   * Modifie un utilisateur existant
   * @param userId - identifiant de l'utilisateur
   * @param input - nouvelles données (username, email)
   * @throws erreur si utilisateur non trouvé ou email déjà utilisé par un autre
   * @returns utilisateur modifié mappé
   */
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

  /**
   * Supprime un utilisateur en marquant la date de suppression (soft delete)
   * @param userId - identifiant de l'utilisateur
   * @throws erreur si utilisateur non trouvé
   * @returns utilisateur supprimé mappé
   */
  async deleteUser(userId: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new Error('Sorry impossible to find this user.');
    }

    const deletedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { deleted: new Date() }, // timestamp suppression
    });

    return mapUser(deletedUser);
  }
}
