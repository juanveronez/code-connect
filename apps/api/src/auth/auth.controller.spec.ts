import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUser = {
  id: 'user-1',
  name: 'Alice',
  email: 'alice@test.com',
  passwordHash: 'hash',
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    authService = {
      register: jest.fn().mockResolvedValue({
        id: 'user-1',
        name: 'Alice',
        email: 'alice@test.com',
      }),
      signIn: jest.fn().mockResolvedValue({ access_token: 'token' }),
    } as unknown as jest.Mocked<AuthService>;

    usersService = {
      findById: jest.fn().mockReturnValue(mockUser),
    } as unknown as jest.Mocked<UsersService>;

    controller = new AuthController(authService, usersService);
  });

  it('register delegates to authService.register', async () => {
    const dto = {
      name: 'Alice',
      email: 'alice@test.com',
      password: 'secret123',
    };
    const result = await controller.register(dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      id: 'user-1',
      name: 'Alice',
      email: 'alice@test.com',
    });
  });

  it('login delegates to authService.signIn', async () => {
    const dto = { email: 'alice@test.com', password: 'secret123' };
    const result = await controller.login(dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.signIn).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('profile returns user from usersService.findById using payload.sub', () => {
    const payload = { sub: 'user-1' };
    const result = controller.profile(payload);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(usersService.findById).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({
      id: 'user-1',
      name: 'Alice',
      email: 'alice@test.com',
    });
  });
});
