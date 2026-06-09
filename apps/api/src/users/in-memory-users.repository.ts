import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class InMemoryUsersRepository extends UsersRepository {
  private readonly users: User[] = [];

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user: User = { id: randomUUID(), ...data };
    this.users.push(user);
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.email === email) ?? null);
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.id === id) ?? null);
  }
}
