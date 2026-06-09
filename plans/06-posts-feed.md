# Plano: Página de Feed de Posts (Code Connect)

## Context

O Code Connect hoje só tem autenticação (login/register/profile). O objetivo é entregar a **página de Feed** ([node `155-3099` do Figma](https://www.figma.com/design/bf3xF1Mak7BbdYLJ4lJ38c/?node-id=155-3099)): grade de cards de publicações com busca, filtro de tags, ordenação (Recentes/Populares), paginação infinita (20 em 20) e menu lateral. A listagem é **pública** (visitantes veem o feed); ações de curtir/comentar ficam desabilitadas para quem não está logado, com aviso de login.

Escopo confirmado com o usuário:
- **Backend**: apenas a **listagem paginada** (sem rotas de criar/editar/deletar/curtir/comentar). Os dados vêm de **seed** com `@faker-js/faker`.
- **Tags**: tabela relacional `Tag` + N:N (`PostTag`).
- **Frontend**: apenas a página de Feed agora, mas **componentizada** (atomic design) para reaproveitar na futura página de detalhes.

Padrões a seguir já existem no repo: repository abstrato como token de DI ([users.repository.ts](apps/api/src/users/users.repository.ts)), `@Public()` + `JwtAuthGuard` global, `useInfiniteQuery` do TanStack Query v5, atomic design + Tailwind v4 com tokens em [index.css](apps/web/src/index.css), e testes `*.test.tsx` + `*.a11y.test.tsx`.

---

## Backend (`apps/api`)

### 1. Schema Prisma + migration ([prisma/schema.prisma](apps/api/prisma/schema.prisma))

Estender `User` e adicionar `Post`, `Tag`, `PostTag`, `Like`, `Comment`. Convenções do repo: id `String @id @default(uuid()) @db.Uuid`, colunas/tabelas snake_case via `@map`/`@@map`.

- **User** (novos campos): `username String @unique`, `avatarUrl String? @map("avatar_url")`. Relations: `posts Post[]`, `likes Like[]`, `comments Comment[]`.
- **Post**: `title`, `description`, `thumbnailUrl String? @map("thumbnail_url")`, `authorId` (relação `author`), `createdAt`/`updatedAt`, relations `tags PostTag[]`, `likes Like[]`, `comments Comment[]`. `@@map("posts")`.
- **Tag**: `name @unique`, `slug @unique`, `posts PostTag[]`. `@@map("tags")`.
- **PostTag**: chave composta `@@id([postId, tagId])`, FKs com `onDelete: Cascade`. `@@map("post_tags")`.
- **Like**: `postId`, `userId`, `createdAt`, `@@unique([postId, userId])`. O `createdAt` é o que permite ordenar "populares" pelos likes dos **últimos 7 dias** (janela móvel: `created_at >= now() - 7 dias`, independente de semana de calendário). `@@map("likes")`.
- **Comment**: `postId`, `authorId`, `content`, `createdAt`. `@@map("comments")`.

Gerar migration via ORM: `pnpm --filter api prisma migrate dev --name create_posts_feed` (NÃO escrever SQL à mão). Rodar `prisma generate`.

### 2. Geração de `username` no registro

`username` não vem no `RegisterDto` — é derivado do e-mail e editável depois.
- Novo util `apps/api/src/users/username.util.ts`: `usernameFromEmail(email)` → slug do local-part (lowercase, remove caracteres inválidos).
- Estender `UsersRepository` ([users.repository.ts](apps/api/src/users/users.repository.ts)): `create` passa a aceitar `username` (e opcional `avatarUrl`); adicionar `findByUsername(username): Promise<User|null>`. Atualizar `InMemoryUsersRepository`, `PrismaUsersRepository`, entidade [user.entity.ts](apps/api/src/users/entities/user.entity.ts) e `UsersService`.
- Em [auth.service.ts](apps/api/src/auth/auth.service.ts) `register`: gerar `username` base e garantir unicidade (loop `findByUsername` anexando sufixo numérico). Incluir `username`/`avatarUrl` no `UserResponseDto`.
- Atualizar testes existentes afetados: [users.service.spec.ts](apps/api/src/users/users.service.spec.ts) e [auth.service.spec.ts](apps/api/src/auth/auth.service.spec.ts) (mock `create`/`findByUsername`, `mockUser` com `username`).

### 3. Módulo Posts (`apps/api/src/posts/`) — espelha o padrão de `users/`

- `entities/post.entity.ts` — domínio: post + `author` (id, name, username, avatarUrl) + `tags` + `likesCount` + `commentsCount`.
- `posts.repository.ts` — **classe abstrata** (token DI): `findFeed(params): Promise<{ items, total }>`.
- `in-memory-posts.repository.ts` — para testes unitários (filtra/ordena em memória, incl. likes-da-semana).
- `prisma-posts.repository.ts` — usa `PrismaService`. `include` de `author`, `tags.tag`, `_count: { likes, comments }`. Busca: `where` com `OR` de `title`/`description` `contains` (insensitive). Tags: `tags: { some: { tag: { slug: { in } } } }`. Ordenação **recent**: `orderBy createdAt desc`. Ordenação **popular**: como Prisma não ordena por contagem *filtrada* por data, usar `$queryRaw` (LEFT JOIN likes com `created_at >= now() - interval '7 days'`, GROUP BY, ORDER BY count desc) para obter ids paginados e re-hidratar preservando a ordem.
- `dto/feed-query.dto.ts` — `page` (default 1, `@Type(()=>Number)`, `@IsInt @Min(1)`), `limit` (default 20, `@Max(50)`), `search?`, `tags?` (CSV → array via transform), `sort?` enum `recent|popular` (default `recent`).
- `dto/post-response.dto.ts` + `dto/feed-response.dto.ts` — `{ items, page, limit, total, hasNextPage }`, com `@ApiProperty`.
- `posts.controller.ts` — `@Public() @Get('posts')` recebendo `@Query() FeedQueryDto`.
- `posts.service.ts` — pass-through fino; calcula `hasNextPage = page*limit < total`.
- `posts.module.ts` — importa `PrismaModule`, provê `PostsService` + `{ provide: PostsRepository, useClass: PrismaPostsRepository }`. Registrar em [app.module.ts](apps/api/src/app.module.ts).

### 4. Módulo Tags mínimo (catálogo p/ o filtro do front)

`TagsModule` enxuto seguindo o mesmo padrão (abstração + in-memory + prisma + service + controller): `@Public() @Get('tags')` → lista `{ name, slug }`. Alimenta as chips de filtro do front de forma data-driven.

### 5. Seed (`apps/api/prisma/seed.ts`)

- Adicionar `@faker-js/faker` como **devDependency**.
- Config do Prisma em `package.json`: `"prisma": { "seed": "ts-node prisma/seed.ts" }` (ts-node já é devDep) + script `"db:seed": "prisma db seed"`. Script raiz opcional `api:prisma:seed`.
- Lógica **idempotente** (deleteMany em ordem: comments → likes → postTags → posts → tags → users seedados):
  - Catálogo fixo de tags (React, Vue, Angular, Node, TypeScript, CSS, Front-end, Back-end, Acessibilidade, UX…).
  - ~10 usuários (senha hasheada com bcrypt, `username` via util, parte com `avatarUrl` e parte `null`).
  - ~60 posts: título/descrição via faker, **~20% com `thumbnailUrl` null** (para exercitar o placeholder), 1–4 tags aleatórias, likes de usuários aleatórios com `createdAt` espalhado nas últimas ~3 semanas — parte **dentro** e parte **fora** da janela de 7 dias, para que "populares" (últimos 7 dias) difira de "recentes" — e comentários aleatórios.

### 6. Testes backend
- **Unit** `posts.service.spec.ts`: `new PostsService(new InMemoryPostsRepository())` — paginação, `search`, filtro por tags, `sort=recent` e `sort=popular` (likes da semana). Passa com Postgres parado.
- **E2E** `test/posts.e2e-spec.ts`: semeia dados via Prisma no teste (incl. likes datados dentro/fora da janela de 7 dias), `GET /posts` **sem token** → 200; valida paginação (`hasNextPage`), `search`, `tags`, `sort=recent` vs `sort=popular` (ordem por likes dos últimos 7 dias). `TRUNCATE` das tabelas novas entre testes (RESTART IDENTITY CASCADE).

---

## Frontend (`apps/web`)

### 1. Camada de API / dados
- `lib/api/posts.types.ts` — `FeedAuthor`, `FeedTag`, `FeedPost`, `FeedResponse`, `FeedParams { page, search, tags[], sort }`.
- `lib/api/posts.ts` — `getFeed(params)` via `api.get('/posts', { params })`; `getTags()` via `api.get('/tags')`.
- `lib/api/hooks.ts` — adicionar `useFeed(params)` com **`useInfiniteQuery`** (queryKey `['feed', params]`, `initialPageParam: 1`, `getNextPageParam: (last) => last.hasNextPage ? last.page+1 : undefined`) e `useTags()`. Funciona logado ou não (interceptor só anexa token se existir).
- Estender `UserProfile` (auth.types) com `username`/`avatarUrl`.

### 2. Tokens de tema ([index.css](apps/web/src/index.css))
Adicionar no `@theme` (sem valores arbitrários nas classes, conforme CLAUDE.md; medidas em `rem`):
- Cores: `--color-tag` (#bcbcbc, fundo das tags claras). Texto escuro das tags = `--color-input-text`/`--color-card`.
- Larguras: `--container-feed` (**75rem**, max-width fixo do layout), `--container-sidebar` (**11rem**, largura da sidebar).
Usar tokens padrão da escala Tailwind (`text-lg`, `text-sm`, `text-2xl`, `rounded-lg`, `size-8`…) para o resto; ícones Material via átomo `MaterialIcon` existente.

### 3. Componentes (atomic design) — cada um com `*.test.tsx` + `*.a11y.test.tsx`

**Átomos** (`components/atoms/`):
- `Avatar` — img redonda; fallback (ícone `account_circle` ou iniciais) quando `avatarUrl` ausente.
- `Tag` — pill; variantes `display` (no card) e `filter` (selecionável, com `onRemove`/✕ e estado `selected`).
- `Thumbnail` — **solução de placeholder**: `object-cover` em container `overflow-hidden rounded-lg`; quando `src` é null/vazio ou dispara `onError`, mostra placeholder estilizado (ícone `code` + label acessível). Reaproveitável no card e na futura tela de detalhes.
- Reusar existentes: `Button`, `MaterialIcon`, `TextLink`, `Icon`.

**Moléculas** (`components/molecules/`):
- `PostActionButton` — `MaterialIcon` + contagem, como `button`. Curtir(`code`/Aprovar) e Comentar(`chat`) ficam **`disabled` + `title`** "Faça login para curtir/comentar" quando não autenticado; Compartilhar(`share`) sempre ativo.
- `PostAuthor` — `Avatar` + `@username`.
- `TagList` — renderiza `Tag` (display) a partir de array; reusável em detalhes.
- `SearchBox` — `MaterialIcon search` + input controlado (placeholder "Digite o que você procura").
- `FilterTabs` — alterna `Recentes` / `Populares` (`value`/`onChange`); ativo verde sublinhado.
- `TagFilterBar` — chips selecionáveis + link "Limpar tudo".
- `NavItem` — item do menu lateral (`MaterialIcon` + label, estado ativo; `Link` ou `button`).

**Organismos** (`components/organisms/`):
- `Sidebar` (Menu desktop) — Logo (reusar asset existente em `public/` se houver; senão logo textual), botão "Publicar" (ghost/borda verde), `NavItem`s: Feed (ativo), **Perfil só se autenticado**, "Sobre nós", e item **login/logout** que alterna label ("Entrar"/"Sair") e ação via `useAuth` + `useNavigate`.
- `PostCard` — card completo do feed: `Thumbnail` + corpo (título, descrição, `TagList`, linha de ações com `PostActionButton`s + `PostAuthor`). Recebe `post` + `isAuthenticated`. Componentizado p/ reuso em detalhes.
- `FeedGrid` — **CSS grid** de `PostCard` (`grid grid-cols-2` que vira **1 coluna em tablet ou menos**, ex.: `grid-cols-1 md:grid-cols-2`, com `gap`); **sem mapear largura de card** — as colunas dividem o espaço disponível. Estados de loading (skeleton), vazio e fim de lista; **sentinela `IntersectionObserver`** que chama `fetchNextPage`.

**Templates** (`components/templates/`):
- `FeedTemplate` — shell da página: `bg-bg`, container centralizado com **max-width fixo `max-w-feed` (75rem)**, `Sidebar` à esquerda (`w-sidebar` = 11rem) + conteúdo à direita (flexível). Reaproveitável para outras páginas autenticadas/públicas.

### 4. Página e rota
- `pages/FeedPage/FeedPage.tsx` — estado de filtros (`search` com debounce, `selectedTags`, `sort`); compõe `FeedTemplate` + `SearchBox` + `TagFilterBar` (alimentado por `useTags`) + `FilterTabs` + `FeedGrid` (via `useFeed`).
- [router.tsx](apps/web/src/router.tsx) — adicionar `/feed` **pública**; mudar `/` para `Navigate to="/feed"`. Redirect pós-login (`LoginForm`) passa a ir para `/feed`.

### 5. Testes frontend
Para cada componente novo, `*.test.tsx` (render + interação essencial) e `*.a11y.test.tsx` (`runAxe`, WCAG 2 AA), usando `renderWithProviders` quando depender de router/query/auth. Casos-chave:
- `Thumbnail`: usa `src`; cai no placeholder sem `src`/em `onError` (placeholder com nome acessível).
- `PostActionButton`: `disabled` + `title` quando não autenticado; contagem visível; botão com nome acessível.
- `Sidebar`: mock `useAuth` — deslogado mostra "Entrar" e **esconde Perfil**; logado mostra "Sair" e Perfil.
- `PostCard`: título/descrição/tags/autor/contagens; curtir e comentar desabilitados sem login.
- `FeedPage`: renderiza cards de `useFeed` mockado; scroll dispara `fetchNextPage` (mock `IntersectionObserver`); estado vazio.

---

## Verificação end-to-end

**Backend**
1. `pnpm db:up` (Postgres).
2. `pnpm --filter api prisma migrate dev --name create_posts_feed` → cria/aplica migration; `prisma generate`.
3. `pnpm --filter api db:seed` → popula ~60 posts (alguns sem thumbnail), tags, likes datados, comentários.
4. `pnpm api:dev` → `GET http://localhost:3000/posts?page=1&limit=20&sort=popular&search=react&tags=react` retorna 200 **sem auth**, com `items`, `total`, `hasNextPage`. `GET /tags` lista o catálogo. Conferir no Swagger `/docs`.
5. `pnpm api:test` (unit, sem DB) e `pnpm api:test:e2e` (com Postgres) passam.

**Frontend**
6. `pnpm web:dev` → `/feed` lista cards (placeholder aparece nos posts sem thumbnail), busca/tags/Recentes-Populares filtram via backend, scroll carrega de 20 em 20.
7. Deslogado: botões de curtir/comentar desabilitados com aviso; menu mostra "Entrar" e oculta "Perfil". Logado: "Sair" + "Perfil" visíveis.
8. `pnpm web:test` (Vitest + a11y) passa.

**Lint**: `pnpm --filter api lint` e `pnpm --filter web lint`.
