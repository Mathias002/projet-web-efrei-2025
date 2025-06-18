import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field()
    username: string;

    @Field({ nullable: true })
    email: string;
<<<<<<< HEAD
=======
  
>>>>>>> 1e3124800fecaf4def574e1c7c0265c449b23955
    @Field()
    password: string;
}