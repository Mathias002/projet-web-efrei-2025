import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
    @Field()
    participantId: string;

    @Field()
    initialMessage?: string;
}