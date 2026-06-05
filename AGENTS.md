# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

pnpm monorepo with two apps managed via `pnpm-workspace.yaml`:

- **`apps/api`** — NestJS 11 REST API (TypeScript), listens on `PORT` env var or `3000`
- **`apps/web`** — React 19 + Vite 8 SPA (TypeScript), communicates with the API

## Commands

All commands run from the repo root using pnpm workspace filters.

### Development
```bash
pnpm api:dev       # NestJS in watch mode
pnpm web:dev       # Vite dev server with HMR
```

### Build
```bash
pnpm api:build     # nest build → dist/
pnpm web:build     # tsc + vite build
```

### Testing (API only)
```bash
pnpm api:test                                         # all unit tests
pnpm --filter api test -- --testPathPattern=app       # single test file
pnpm --filter api test:e2e                            # e2e suite (jest-e2e.json)
pnpm --filter api test:cov                            # with coverage
```

### Lint / Format
```bash
pnpm --filter api lint      # eslint --fix on src/ and test/
pnpm --filter api format    # prettier --write on src/ and test/
pnpm --filter web lint      # eslint on web src/
```

## Key conventions

### Git — Conventional Commits (both apps)

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <description>

Types: feat | fix | docs | style | refactor | test | chore | perf | ci | build | revert
```

Examples:
- `feat(auth): add JWT refresh token endpoint`
- `fix(button): correct hover state on disabled variant`
- `test(user-card): add render test for avatar fallback`
- `chore: update pnpm lockfile`

### Frontend — React (`apps/web`)

- **Component architecture**: [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) — atoms → molecules → organisms → templates → pages
  - `src/components/atoms/` — primitive UI elements (Button, Input, Label, Icon…)
  - `src/components/molecules/` — simple compositions of atoms
  - `src/components/organisms/` — complex sections composed of molecules/atoms
  - `src/components/templates/` — page-level layout skeletons
  - `src/pages/` — concrete page instances that hydrate templates with data
- **Styling**: Tailwind CSS — utility classes only, no custom CSS files unless strictly necessary
- **Testing**: every component must have a `*.test.tsx` alongside it (Vitest + Testing Library)
  - Cover the essential usage: renders without crashing, reflects the primary prop/state, and any critical interaction
  - Run tests with `pnpm web:test`

### Backend — NestJS (`apps/api`)

- **REST adherence**:
  - Resource-oriented URLs — nouns, not verbs (`/posts`, `/users/:id`, not `/getPosts`)
  - Correct HTTP verbs: `GET` (read), `POST` (create), `PUT/PATCH` (update), `DELETE` (remove)
  - Meaningful HTTP status codes: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `422`, `500`
  - Consistent JSON response shape; use NestJS `@HttpCode()` and exception filters
  - Stateless requests — no server-side session state
- **Module pattern**: each resource gets a Module + Controller + Service triple; wire into `AppModule`
- **Tests**: unit tests live alongside source as `*.spec.ts`; e2e tests are in `apps/api/test/`
