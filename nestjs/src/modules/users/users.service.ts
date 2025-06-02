import { Injectable } from '@nestjs/common';
import { User } from '../../models/user';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      username: 'test 1',
      email: 'test1@test1.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      username: 'test 2',
      email: 'test2@test2.com',
      createdAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      username: 'test 3',
      email: 'test3@test3.com',
      createdAt: new Date('2024-01-03'),
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  findByIds(ids: string[]): User[] | null {
    return this.users.filter(user => ids.includes(user.id));
  }
}