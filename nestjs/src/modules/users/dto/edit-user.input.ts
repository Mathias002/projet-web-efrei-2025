import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EditUserInput {
    @Field()
    username: string;

    @Field({ nullable: true })
    email: string;
}