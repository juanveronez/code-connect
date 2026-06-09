import { User } from './entities/user.entity';

/**
 * Contrato de persistência de usuários e, ao mesmo tempo, token de DI.
 * Implementações: {@link InMemoryUsersRepository} (testes unitários) e
 * {@link PrismaUsersRepository} (produção, integração e e2e).
 */
export abstract class UsersRepository {
  abstract create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
