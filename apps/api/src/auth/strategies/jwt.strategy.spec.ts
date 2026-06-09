import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;

    strategy = new JwtStrategy(configService);
  });

  it('returns only the sub from the payload', () => {
    expect(strategy.validate({ sub: 'user-1' })).toEqual({ sub: 'user-1' });
  });

  it('does not leak extra claims such as email', () => {
    const result = strategy.validate({
      sub: 'user-1',
      email: 'alice@test.com',
    } as unknown as { sub: string });

    expect(result).toEqual({ sub: 'user-1' });
    expect(result).not.toHaveProperty('email');
  });
});
