import {ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => Date, { nullable: true })
    deleted?: Date | null;
}