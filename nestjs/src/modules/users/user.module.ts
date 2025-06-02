import { Module } from "@nestjs/common";
import { UsersService } from '../users/users.service';
import { UsersResolver } from './users.resolver';

@Module({
    providers: [UsersService, UsersResolver],
    exports: [UsersService],
})

export class UsersModule {}