import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    prisma = moduleFixture.get(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('register → duplicate register (409) → login → profile', async () => {
    const server = app.getHttpServer();
    const credentials = {
      name: 'Alice',
      email: 'alice@e2e.com',
      password: 'secret123',
    };

    const register = await request(server)
      .post('/auth/register')
      .send(credentials)
      .expect(201);
    const registerBody = register.body as {
      email: string;
      passwordHash?: string;
    };
    expect(registerBody.email).toBe('alice@e2e.com');
    expect(registerBody.passwordHash).toBeUndefined();

    await request(server).post('/auth/register').send(credentials).expect(409);

    const login = await request(server)
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    const token = (login.body as { access_token: string }).access_token;
    expect(token).toBeDefined();

    const profile = await request(server)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect((profile.body as { email: string }).email).toBe('alice@e2e.com');
  });

  it('login with invalid credentials returns 401', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody@e2e.com', password: 'wrong' })
      .expect(401);
  });
});
