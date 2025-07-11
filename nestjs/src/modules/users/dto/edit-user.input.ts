import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EditUserInput {
    @Field({ nullable: true })
    username?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    password?: string;
}