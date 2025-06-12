import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/message';
import { ConversationsService } from './conversations.service';
import { MessagesService } from '../messages/messages.service';
import { CreateConversationInput } from './dto/create-conversation.input';

/**
 * Resolver GraphQL pour la gestion des conversations dans l'application de chat.
 * Fournit les requêtes et mutations pour récupérer, créer des conversations
 * et résoudre les messages liés à une conversation.
 */

@Resolver(() => Conversation)
export class ConversationsResolver {
    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly messagesService: MessagesService,
    ) { }

    // Récupère toutes les conversations d’un utilisateur via son id

    // 🧩 Paramètres :
    // - `userId: String!` → Id de l'utilisateur (**obligatoire**)

    /**
     * 📌 Requête GraphQL de test :
     * 
     * query GetUserConversations {
     *   userConversations(userId: "userId") {
     *     id
     *     participants {
     *       id
     *       username
     *       email
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *     messages {
     *       id
     *       content
     *       senderId
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *     createdBy
     *     createdAt
     *     lastMessage
     *   }
     * }
     */
    @Query(() => [Conversation])
    async userConversations(
        @Args('userId') userId: string,
    ): Promise<Conversation[]> {
        return this.conversationsService.findByUserId(userId)
    }

    // Récupère une conversation via son id

    // 🧩 Paramètres :
    // - `conversationId: String!` → Id de la conversation (**obligatoire**)

    /**
     * 📌 Requête GraphQL de test : 
     * 
     * query GetConversationById {
     *   conversation(id: "conversationId") {
     *     id
     *     participants {
     *       id
     *       username
     *       email
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *     messages {
     *       id
     *       content
     *       senderId
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *     createdBy
     *     createdAt
     *     lastMessage
     *   }
     * }
     */
    @Query(() => Conversation, { nullable: true })
    async conversation(
        @Args('id') id: string,
    ): Promise<Conversation | null> {
        return this.conversationsService.findById(id)
    }

    // Créer une conversation entre deux utilisateur

    // 🧩 Paramètres :
    // - `participantId: String!` → Id du participant (**obligatoire**)
    // - `creatorId: String!` → Id du créateur de la conversation) (**obligatoire**)
    // - `initialMessage: String` → Contenu du message initial) (**optionel**)

    /**
     * 📌 Mutation GraphQL de test
     * 
     * mutation CreateConversationSimple {
     *   createConversation(
     *     input: { 
     *       participantId: "participantId", 
     *       initialMessage: "Salut Charlie ! Comment ça va ?",
     *     }, 
     *     creatorId: "creatorId"
     *   ) {
     *     id
     *     participants {
     *       id
     *       username
     *       email
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *     messages {
     *       id
     *       content
     *       senderId
     *       createdAt
     *       updatedAt
     *       deleted
     *     }
     *     createdBy
     *     createdAt
     *     lastMessage
     *   }
     * }
     */

    @Mutation(() => Conversation)
    async createConversation(
        @Args('input') input: CreateConversationInput,
        @Args('creatorId') creatorId: string,
    ): Promise<Conversation> {
        return this.conversationsService.create(input, creatorId);
    }

    // Résout le champ `messages` d’une conversation en récupérant ses messages associés

    @ResolveField(() => [Message])
    async messages(@Parent() conversation: Conversation): Promise<Message[]> {
        return this.messagesService.findByConversationId(conversation.id);
    }

}