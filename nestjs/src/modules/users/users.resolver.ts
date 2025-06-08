import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from '../../models/user';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User )
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Query(() => User)
    async user(
        @Args('id') id: string
    ): Promise<User| null>  {
        return this.usersService.findById(id);
    }

    @Query(() => User)
    async usersByIds(
        @Args('ids', { type: () => [String] }) ids: string[]
    ): Promise<User[]> {
        return this.usersService.findByIds(ids);
    }

    @Mutation(() => User)
    async createUser(
            @Args('input') input: CreateUserInput,
        ): Promise<User> {
        return this.usersService.createUser(input);
    }
    
    @Mutation(() => User)
    async editUser(
            @Args('userId') userId: string,
            @Args('input') input: CreateUserInput,
        ): Promise<User> {
        return this.usersService.editUser(userId, input);
    }

    @Mutation(() => User)
    async deleteUser(
            @Args('userId') userId: string,
        ): Promise<User> {
        return this.usersService.deleteUser(userId);
    }

}