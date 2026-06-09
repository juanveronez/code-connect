import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

const makeContext = () =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    guard = new JwtAuthGuard(reflector);
  });

  it('returns true without authenticating when route is public', () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    expect(guard.canActivate(makeContext())).toBe(true);
  });

  it('delegates to passport when route is not public', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const superCanActivate = jest
      .spyOn(AuthGuard('jwt').prototype as JwtAuthGuard, 'canActivate')
      .mockReturnValue(true);

    expect(guard.canActivate(makeContext())).toBe(true);
    expect(superCanActivate).toHaveBeenCalled();

    superCanActivate.mockRestore();
  });
});
