import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from '../../models/user';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { EditUserInput } from './dto/edit-user.input';
import { LoginInput } from '../login/login.input';

/**
 * Resolver GraphQL pour la gestion des utilisateurs dans l'application de chat.
 * Fournit les requêtes et mutations pour récupérer modifier et créer des utilisateurs.
 */

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    // Récupère tous les utilisateurs actifs 

    /**
     * 📌 Requête GraphQL de test :
     * 
     * query GetAllUsers {
     *   users {
     *     id
     *     username
     *     email
     *     createdAt
     *     updatedAt
     *     deleted
     *   }
     * }
     */
    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.usersService.findAll();
    }

    // Récupère un utilisateur via son id

    // 🧩 Paramètres :
    // - `userId: String!` → Id de l'utilisateur (**obligatoire**)

    /**
     * 📌 Requête GraphQL de test :
     * 
     * query GetUserById {
     *   user(id: "userId") {
     *     id
     *     username
     *     email
     *     createdAt
     *     updatedAt
     *     deleted
     *   }
     * }
     */
    @Query(() => User)
    async user(
        @Args('id') id: string
    ): Promise<User | null> {
        return this.usersService.findById(id);
    }

    // Récupère plusieurs utilisateurs via une liste d'ids

    // 🧩 Paramètres :
    // - `ids: String[]!` → Ids des utilisateurs (**obligatoire**)

    /**
     * 📌 Requête GraphQL de test :
     * 
     * query GetUsersByIds {
     *   usersByIds(ids: ["userId1", "userId2"]) {
     *     id
     *     username
     *     email
     *     createdAt
     *     updatedAt
     *     deleted
     *   }
     * }
     */
    @Query(() => User)
    async usersByIds(
        @Args('ids', { type: () => [String] }) ids: string[]
    ): Promise<User[]> {
        return this.usersService.findByIds(ids);
    }

    // Créer un utilisateur 

    // 🧩 Paramètres :
    // - `username: String!` → Username du nouveau utilisateur (**obligatoire**)
    // - `email: String!` → Email du nouveau utilisateur (**obligatoire**)

    /**
     * 📌 Mutation GraphQL de test :
     * 
     * mutation CreateUser {
     *   createUser(
     *     input: { 
     *       username: "username",
     *       email: "email@test.test"
     *     }
     *   ) {
     *     id
     *     username
     *     email
     *     createdAt
     *     updatedAt
     *     deleted
     *   }
     * }
     */
    @Mutation(() => User)
    async createUser(
        @Args('input') input: CreateUserInput,
    ): Promise<User> {
        return this.usersService.createUser(input);
    }

    // Modifie un utilisateur via son id

    // 🧩 Paramètres :
    // - `userId: String!` → Id de l'utilisateur ciclé par la modification (**obligatoire**)
    // - `username: String!` → Nouveau username de l'utilisateur (**obligatoire**)
    // - `email: String!` → Nouveau email de l'utilisateur (**obligatoire**)

    /**
     * 📌 Mutation GraphQL de test :
     * 
     * mutation EditUser {
     *   editUser(
     *     userId: "userId",
     *     input: { 
     *       username: "usernameEdited",
     *       email: "emailedited@emailedited.test"
     *     }
     *   ) {
     *     id
     *     username
     *     email
     *     createdAt
     *     updatedAt
     *     deleted
     *   }
     * }
     */
    @Mutation(() => User)
    async editUser(
        @Args('userId') userId: string,
        @Args('input') input: EditUserInput,
    ): Promise<User> {
        return this.usersService.editUser(userId, input);
    }

    // Supprime (soft delete) un utilisateur via son id

    // 🧩 Paramètres :
    // - `userId: String!` → Id de l'utilisateur ciblé par la suppression (**obligatoire**)

    /**
     * 📌 Mutation GraphQL de test : 
     * 
     * mutation DeletedUser {
     *   deleteUser(userId: "userId") {
     *     id
     *     username
     *     email
     *     createdAt
     *     updatedAt
     *     deleted
     *   }
     * }
     */
    @Mutation(() => User)
    async deleteUser(
        @Args('userId') userId: string,
    ): Promise<User> {
        return this.usersService.deleteUser(userId);
    }

    @Mutation(() => User, { nullable: true })
    async loginUser(
        @Args('input') input: LoginInput
    ): Promise<User | null> {
        return this.usersService.loginUser(input);
    }
}