import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class SendMessageInput{
    @Field()
    content: string;

    @Field()
    conversationId: string;

    @Field()
    senderId: string;
}