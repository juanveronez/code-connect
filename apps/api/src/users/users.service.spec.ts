import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('creates a user and returns it with an id', () => {
    const user = service.create({
      name: 'Alice',
      email: 'alice@test.com',
      passwordHash: 'hash',
    });
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
    expect(user.passwordHash).toBe('hash');
  });

  it('findByEmail returns the user when it exists', () => {
    service.create({
      name: 'Bob',
      email: 'bob@test.com',
      passwordHash: 'hash',
    });
    const found = service.findByEmail('bob@test.com');
    expect(found).toBeDefined();
    expect(found?.email).toBe('bob@test.com');
  });

  it('findByEmail returns undefined when email not found', () => {
    expect(service.findByEmail('missing@test.com')).toBeUndefined();
  });

  it('findById returns the user when it exists', () => {
    const created = service.create({
      name: 'Carol',
      email: 'carol@test.com',
      passwordHash: 'hash',
    });
    const found = service.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  it('findById returns undefined when id not found', () => {
    expect(service.findById('nonexistent-id')).toBeUndefined();
  });
});
