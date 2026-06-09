import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const mockUser = {
  id: 'user-1',
  name: 'Alice',
  email: 'alice@test.com',
  passwordHash: '$2b$10$hashedpassword',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    } as unknown as jest.Mocked<JwtService>;

    authService = new AuthService(usersService, jwtService);
  });

  describe('register', () => {
    it('creates and returns the user without passwordHash', async () => {
      usersService.findByEmail.mockReturnValue(undefined);
      usersService.create.mockReturnValue(mockUser);

      const result = await authService.register({
        name: 'Alice',
        email: 'alice@test.com',
        password: 'secret123',
      });

      expect(result).toEqual({
        id: 'user-1',
        name: 'Alice',
        email: 'alice@test.com',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.create).toHaveBeenCalled();
    });

    it('throws ConflictException when email is already registered', async () => {
      usersService.findByEmail.mockReturnValue(mockUser);

      await expect(
        authService.register({
          name: 'Alice',
          email: 'alice@test.com',
          password: 'secret123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    it('returns access_token on valid credentials', async () => {
      const hash = await bcrypt.hash('secret123', 10);
      usersService.findByEmail.mockReturnValue({
        ...mockUser,
        passwordHash: hash,
      });

      const result = await authService.signIn({
        email: 'alice@test.com',
        password: 'secret123',
      });

      expect(result).toEqual({ access_token: 'signed-token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 'user-1' });
    });

    it('throws UnauthorizedException when user not found', async () => {
      usersService.findByEmail.mockReturnValue(undefined);

      await expect(
        authService.signIn({ email: 'missing@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      const hash = await bcrypt.hash('correct', 10);
      usersService.findByEmail.mockReturnValue({
        ...mockUser,
        passwordHash: hash,
      });

      await expect(
        authService.signIn({ email: 'alice@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
