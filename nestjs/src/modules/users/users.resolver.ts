import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from '../../models/user';
import { UsersService } from './users.service';

@Resolver(() => User )
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [User])
    users(): User[]{
        return this.usersService.findAll();
    }

    @Query(() => User, {nullable: true})
    user(@Args('id') id: string): User | null{
        return this.usersService.findById(id);
    }
}