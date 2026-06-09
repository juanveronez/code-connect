import { InMemoryUsersRepository } from './in-memory-users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(new InMemoryUsersRepository());
  });

  it('creates a user and returns it with an id', async () => {
    const user = await service.create({
      name: 'Alice',
      email: 'alice@test.com',
      passwordHash: 'hash',
    });
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
    expect(user.passwordHash).toBe('hash');
  });

  it('findByEmail returns the user when it exists', async () => {
    await service.create({
      name: 'Bob',
      email: 'bob@test.com',
      passwordHash: 'hash',
    });
    const found = await service.findByEmail('bob@test.com');
    expect(found).toBeDefined();
    expect(found?.email).toBe('bob@test.com');
  });

  it('findByEmail returns null when email not found', async () => {
    expect(await service.findByEmail('missing@test.com')).toBeNull();
  });

  it('findById returns the user when it exists', async () => {
    const created = await service.create({
      name: 'Carol',
      email: 'carol@test.com',
      passwordHash: 'hash',
    });
    const found = await service.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  it('findById returns null when id not found', async () => {
    expect(await service.findById('nonexistent-id')).toBeNull();
  });
});
