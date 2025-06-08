import {ObjectType, Field, ID} from '@nestjs/graphql';
import {User} from './user';
import {Conversation} from './conversation';

@ObjectType()
export class Message {
    @Field(() => ID)
    id: string;

    @Field()
    content: string;

    @Field()
    senderId: string;

    @Field(()=> User, { nullable: true })
    sender?: User;

    @Field()
    conversationId: string;

    @Field(() => Conversation, { nullable: true })
    conversation?: Conversation;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

}