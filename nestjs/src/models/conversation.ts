import{ObjectType, Field, ID} from '@nestjs/graphql';
import {User} from './user';
import {Message} from './message';

@ObjectType()
export class Conversation {
    @Field(() => ID)
    id: string;

    @Field(() => [User])
    participants: User[];

    @Field(() => [Message], { nullable: true })
    messages?: Message[];

    @Field()
    nom: string;

    @Field()
    createdBy: string;

    @Field()
    createdAt: Date;

    @Field({ nullable: true })
    lastMessage?: Date;
}