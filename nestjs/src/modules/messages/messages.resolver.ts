import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { Conversation } from '../../models/conversation';
import { MessagesService } from './messages.service';
import { UsersService } from '../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import { SendMessageInput } from './dto/send-message.input';
import { EditMessageInput } from './dto/edit-message.input';

/**
 * Resolver GraphQL pour la gestion des messages dans l'application de chat.
 * Fournit les requêtes et mutations pour récupérer modifier et créer des messages
 * et résoudre les conversations et les utilisateurs liés à un/des message(s).
 */

@Resolver(() => Message)
export class MessagesResolver {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly conversationsService: ConversationsService,
        private readonly usersService: UsersService,
    ) { }

    // Récupère tous les messages d'une conversation

    // 🧩 Paramètres :
    // - `conversationId: String!` → Id de la conversation (**obligatoire**)

    /**
     * 📌 Requête GraphQL de test :
     * 
     * query GetConversationMessages {
     *   conversationMessages(conversationId: "conversationId") {
     *     id
     *     content
     *     senderId
     *     conversationId
     *     createdAt
     *     sender {
     *       id
     *       username
     *       email
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *   }
     * }
     */
    @Query(() => [Message])
    async conversationMessages(@Args('conversationId') conversationId: string): Promise<Message[]> {
        return this.messagesService.findByConversationId(conversationId);
    }

    // Envoie un nouveau message dans une conversation

    // 🧩 Paramètres :
    // - `content: String!` → Contenu du message (**obligatoire**)
    // - `conversationId: String!` → Id de la conversation (**obligatoire**)
    // - `senderId: String` → Id de l'utilisateur envoyant le message (**obligatoire**)

    /**
     * 📌 Mutation GraphQL de test :
     * 
     * mutation SendMessage {
     *   sendMessage(input: {
     *     content: "ça va super et toi ?"
     *     conversationId: "conversationId"
     *     senderId: "senderId"
     *   }) {
     *     id
     *     content
     *     senderId
     *     conversationId
     *     createdAt
     *     sender {
     *       id
     *       username
     *       email
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *     conversation {
     *       id
     *       participants {
     *         username
     *       }
     *     }
     *   }
     * }
     */
    @Mutation(() => Message)
    async sendMessage(@Args('input') input: SendMessageInput): Promise<Message> {
        return this.messagesService.send(input);
    }

    // Modifie un message

    // 🧩 Paramètres :
    // - `userId: String!` → Id de l'utilisateur executant la requête (**obligatoire**)
    // - `messageId: String!` → Id du message ciblé par la modification (**obligatoire**)
    // - `newContent: String` → Contenu du nouveau message (**obligatoire**)

    /**
     * 📌 Mutation GraphQL de test :
     * 
     * mutation {
     *   editMessage(
     *     userId: "userId",
     *     input: {
     *       messageId: "messageId"
     *       newContent: "Message modifié 🎯"
     *     }
     *   ) {
     *     id
     *     content
     *     updatedAt
     *   }
     * }
     */
    @Mutation(() => Message)
    async editMessage(
        @Args('input') input: EditMessageInput,
        @Args('userId') userId: string // à remplacer par @CurrentUser plus tard
    ): Promise<Message> {
        return this.messagesService.editMessage(input, userId);
    }

    // Supprime un message (soft delete)

    // 🧩 Paramètres :
    // - `userId: String!` → Id de l'utilisateur executant la requête (**obligatoire**)
    // - `messageId: String!` → Id du message ciblé par la supression (**obligatoire**)

    /**
     * 📌 Mutation GraphQL de test : 
     * 
     * mutation DeletedMessage {
     *   deleteMessage(messageId: "messageId", userId: "userId") {
     *     id
     *     content
     *     conversationId
     *     createdAt
     *     senderId
     *     deleted
     *     updatedAt
     *   }
     * }
     */
    @Mutation(() => Message)
    async deleteMessage(
        @Args('messageId') messageId: string,
        @Args('userId') userId: string,
    ): Promise<Message> {
        return this.messagesService.deleteMessage(messageId, userId);
    }

    // Résout l’expéditeur (`sender`) d’un message à partir de son `senderId`

    @ResolveField(() => User, { nullable: true })
    async sender(@Parent() message: Message): Promise<User | null> {
        return this.usersService.findById(message.senderId);
    }

    // Résout la conversation associée à un message via son `conversationId`

    @ResolveField(() => Conversation, { nullable: true })
    async conversation(@Parent() message: Message): Promise<Conversation | null> {
        return this.conversationsService.findById(message.conversationId);
    }
}