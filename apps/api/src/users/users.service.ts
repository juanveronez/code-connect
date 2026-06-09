import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(data: { name: string; email: string; passwordHash: string }): User {
    const user: User = { id: crypto.randomUUID(), ...data };
    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}
