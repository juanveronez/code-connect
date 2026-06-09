# Plano: Backend de Autenticação — 3 endpoints (NestJS 11)

## Context

A API em `apps/api` é hoje apenas o boilerplate do NestJS (`AppController`/`AppService`
"Hello World"), sem nenhum pacote de auth, validação ou Swagger instalado. Precisamos
implementar autenticação de usuários com **3 endpoints**:

1. **Cadastro** — criar usuário (nome, email, senha)
2. **Login** — autenticar e retornar um **JWT**
3. **Perfil** — retornar dados do usuário logado, protegido por autenticação JWT usando
   **@nestjs/passport** com a estratégia `passport-jwt`, seguindo o padrão da
   [doc oficial do NestJS](https://docs.nestjs.com/recipes/passport)

Restrições desta etapa:
- Persistência apenas em **array em memória** — sem banco de dados real.
- **Swagger** documentando inputs e outputs.

Decisões confirmadas com o usuário:
- Estrutura **UsersModule + AuthModule** (padrão exato da doc).
- Senha **hasheada com bcrypt** antes de salvar / comparada no login.
- Segredo JWT via **@nestjs/config** (`.env`), não hardcoded.
- Autenticação via **Passport** (`@nestjs/passport` + `passport-jwt`), não um guard custom.
- Guard JWT **global** (`APP_GUARD`): tudo protegido por padrão; rotas públicas optam por sair
  com o decorator `@Public()`.
- Payload do JWT contém **apenas `{ sub }`** (id do usuário) — sem `email`, para reduzir a
  exposição de dados no token.

## Dependências a instalar (em `apps/api`)

```bash
pnpm --filter api add @nestjs/swagger @nestjs/jwt @nestjs/config @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
pnpm --filter api add -D @types/bcrypt @types/passport-jwt
```

## Estrutura de arquivos

```
apps/api/
├── .env                         # JWT_SECRET, JWT_EXPIRES_IN, PORT (criar; adicionar ao .gitignore)
├── .env.example                 # mesmas chaves, sem valores secretos (versionado)
└── src/
    ├── main.ts                  # MODIFICAR: ValidationPipe global + setup Swagger
    ├── app.module.ts            # MODIFICAR: ConfigModule.forRoot({isGlobal:true}) + UsersModule + AuthModule
    ├── users/
    │   ├── users.module.ts      # exporta UsersService
    │   ├── users.service.ts     # array em memória: create, findByEmail, findById
    │   ├── users.service.spec.ts
    │   └── entities/
    │       └── user.entity.ts   # { id, name, email, passwordHash }
    └── auth/
        ├── auth.module.ts       # PassportModule + JwtModule.registerAsync + JwtStrategy + APP_GUARD global
        ├── auth.controller.ts   # POST /auth/register, POST /auth/login, GET /auth/profile
        ├── auth.controller.spec.ts
        ├── auth.service.ts      # register() + signIn() (bcrypt + JwtService)
        ├── auth.service.spec.ts
        ├── strategies/
        │   ├── jwt.strategy.ts        # PassportStrategy(Strategy,'jwt'): extrai Bearer, valida, retorna { sub }
        │   └── jwt.strategy.spec.ts
        ├── guards/
        │   ├── jwt-auth.guard.ts      # extends AuthGuard('jwt'); respeita @Public() via Reflector
        │   └── jwt-auth.guard.spec.ts
        ├── types/
        │   └── authenticated-user.ts  # AuthenticatedUser { sub } — shape de request.user
        ├── decorators/
        │   ├── current-user.decorator.ts   # @CurrentUser() lê request.user
        │   └── public.decorator.ts          # @Public() marca rota como aberta (IS_PUBLIC_KEY)
        └── dto/
            ├── register.dto.ts       # name, email, password (+ class-validator + @ApiProperty)
            ├── login.dto.ts          # email, password
            ├── auth-response.dto.ts  # { access_token } (output do login)
            └── user-response.dto.ts  # { id, name, email } (output sem senha)
```

## Detalhes de implementação

### `users/` (fonte da verdade dos dados)
- `User` entity: `id: string`, `name: string`, `email: string`, `passwordHash: string`.
- `UsersService`: array privado `private readonly users: User[] = []`.
  - `create({name, email, passwordHash})` → gera id (`crypto.randomUUID()`), faz push, retorna o `User`.
  - `findByEmail(email)` → `User | undefined`.
  - `findById(id)` → `User | undefined`.
- `UsersModule` exporta `UsersService` para o `AuthModule` consumir.

### `auth/auth.service.ts`
- Injeta `UsersService` e `JwtService`.
- `register(dto)`: se `findByEmail` já existe → `ConflictException` (409). Senão
  `bcrypt.hash(password, 10)`, chama `usersService.create`, retorna `UserResponseDto` (sem hash).
- `signIn(email, password)`: busca por email; se não existe ou `bcrypt.compare` falha →
  `UnauthorizedException` (401). Senão monta payload `{ sub: user.id }` e retorna
  `{ access_token: await jwtService.signAsync(payload) }`. **O `email` não entra no token**.

### `auth/strategies/jwt.strategy.ts` (padrão Passport da doc)
- `@Injectable()` que estende `PassportStrategy(Strategy, 'jwt')`.
- `super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false,
  secretOrKey: configService.getOrThrow('JWT_SECRET') })` — Passport cuida da extração do Bearer
  e da verificação de assinatura/expiração.
- `validate(payload)` retorna **apenas `{ sub: payload.sub }`** (tipo `AuthenticatedUser`); esse
  objeto é o que o Passport anexa em `request.user`.

### `auth/guards/jwt-auth.guard.ts`
- `@Injectable()` que estende `AuthGuard('jwt')`.
- `canActivate` sobrescrito: usa `Reflector.getAllAndOverride(IS_PUBLIC_KEY, [handler, class])`;
  se a rota é `@Public()` retorna `true` (sem autenticar), senão delega a `super.canActivate()`.
- Registrado como `APP_GUARD` (global) no `AuthModule`.

### `auth/decorators/public.decorator.ts`
- `IS_PUBLIC_KEY = 'isPublic'` e `Public = () => SetMetadata(IS_PUBLIC_KEY, true)`.

### `auth/auth.controller.ts`
- `POST /auth/register` → `@Public()` + `@HttpCode(201)`, body `RegisterDto`, retorna `UserResponseDto`.
- `POST /auth/login` → `@Public()` + `@HttpCode(200)`, body `LoginDto`, retorna `AuthResponseDto`.
- `GET /auth/profile` → protegido pelo guard global (sem `@UseGuards`) + `@ApiBearerAuth()`; usa
  `@CurrentUser()` (`{ sub }`) para `usersService.findById(sub)` e retorna `UserResponseDto`.
- Decorar todas as rotas com `@ApiTags('auth')` e `@ApiResponse(...)` para documentar saídas e
  erros (409/401).

### `auth/auth.module.ts`
- `imports: [UsersModule, PassportModule, JwtModule.registerAsync({ imports:[ConfigModule], inject:[ConfigService], useFactory: cs => ({ secret: cs.getOrThrow('JWT_SECRET'), signOptions:{ expiresIn: cs.getOrThrow('JWT_EXPIRES_IN') } }) })]`.
- `providers: [AuthService, JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }]`,
  `controllers: [AuthController]`. (`JwtModule` segue necessário para o `signIn` assinar o token.)

### `main.ts` (MODIFICAR)
- `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`.
- Setup Swagger: `DocumentBuilder().setTitle('Code Connect API').addBearerAuth().build()`,
  `SwaggerModule.setup('docs', app, document)`.

### `app.module.ts` (MODIFICAR)
- `ConfigModule.forRoot({ isGlobal: true })` + importar `UsersModule` e `AuthModule`.
  Manter `AppController`/`AppService` existentes.

### DTOs
- `register.dto.ts`: `@IsString() @IsNotEmpty() name`, `@IsEmail() email`,
  `@IsString() @MinLength(6) password` — cada um com `@ApiProperty`.
- Output DTOs (`user-response`, `auth-response`) com `@ApiProperty` para o Swagger documentar as
  respostas.

## Testes (convenção do repo — `*.spec.ts` ao lado da fonte)
- `users.service.spec.ts`: create/findByEmail/findById sobre o array.
- `auth.service.spec.ts`: register (sucesso + conflito), signIn (sucesso + credenciais inválidas)
  — mock de `UsersService` e `JwtService`; confirma que o payload assinado é `{ sub }` (sem email).
- `auth.controller.spec.ts`: delega aos serviços; profile retorna usuário a partir de `{ sub }`.
- `jwt.strategy.spec.ts`: `validate({ sub })` retorna `{ sub }` e não vaza claims extras (ex: email).
- `jwt-auth.guard.spec.ts`: rota `@Public()` retorna `true` sem autenticar; rota normal delega ao super.

## Verificação

```bash
pnpm --filter api lint   # sem erros de lint
pnpm api:test            # todos os specs verdes
pnpm api:build           # compila sem erros
pnpm api:dev             # sobe a API
```
Com a API rodando:
- Abrir `http://localhost:3000/docs` → confirmar os 3 endpoints e o botão **Authorize** (bearer).
- `POST /auth/register` com `{name,email,password}` → 201 + usuário sem senha. Mesmo email de novo → 409.
  Body inválido (email malformado, senha < 6) → 400.
- `POST /auth/login` → 200 + `access_token`. Senha errada ou usuário inexistente → 401.
  Decodificar o token → payload deve conter **apenas `sub`, `iat`, `exp`** (sem `email`).
- `GET /auth/profile` sem token → 401; token inválido/expirado/assinado com outro segredo → 401;
  com `Authorization: Bearer <token>` válido → 200 + dados do usuário; token válido com `sub`
  inexistente → 404.
