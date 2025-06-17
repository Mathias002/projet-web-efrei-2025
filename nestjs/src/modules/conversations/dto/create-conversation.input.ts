import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
    @Field()
    participantId: string;

    @Field()
    nom: string;

    @Field({ nullable: true })
    initialMessage?: string;
}