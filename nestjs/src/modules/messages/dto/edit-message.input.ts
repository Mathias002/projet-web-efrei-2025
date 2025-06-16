import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class EditMessageInput{
    @Field()
    newContent: string;

    @Field()
    messageId: string;
}