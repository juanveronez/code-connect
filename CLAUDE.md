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
- **Style and color conventions** — see detailed guidelines below
- **Testing**: every component must have a `*.test.tsx` alongside it (Vitest + Testing Library)
  - Cover the essential usage: renders without crashing, reflects the primary prop/state, and any critical interaction
  - Run tests with `pnpm web:test`
- **Accessibility testing**: every component must also have a `*.a11y.test.tsx` alongside it (jest-axe + axe-core, WCAG 2 AA ruleset)
  - See [Accessibility testing guidelines](#accessibility-testing-guidelines-wcag-2-aa) below

### Accessibility testing guidelines (WCAG 2 AA)

Every component gets a `ComponentName.a11y.test.tsx` file alongside its `ComponentName.test.tsx`. The goal is to catch structural and semantic WCAG 2 AA violations automatically on every CI run.

#### Setup and helpers

- **Library**: `jest-axe` (wraps axe-core); matchers registered globally in `src/test/setup.ts`
- **Shared helper**: `src/test/a11y.ts` exports `runAxe(container)` pre-configured for WCAG 2 AA:

```ts
import { runAxe } from '../../../test/a11y'
```

#### File naming and location

```
src/components/atoms/Button/
  Button.tsx
  Button.test.tsx        ← behaviour tests
  Button.a11y.test.tsx   ← accessibility tests   ← NEW
```

#### Test structure

```tsx
import { render } from '@testing-library/react'
import { runAxe } from '../../../test/a11y'
import { Button } from './Button'

describe('Button – acessibilidade (WCAG 2 AA)', () => {
  it('variante primary com texto não tem violações', async () => {
    const { container } = render(<Button>Entrar</Button>)
    expect(await runAxe(container)).toHaveNoViolations()
  })
})
```

#### Rules for writing a11y tests

1. **Test realistic usage** — render the component exactly as it appears in the app (with labels, wrappers, siblings). A `Checkbox` isolated without a label will fail, but that is the invalid usage, not a bug.
2. **Also test invalid usage** with `not.toHaveNoViolations()` to confirm axe catches the violation. This documents the contract: "this component is only accessible when used with a label."
3. **Wrap router-dependent components** in `<MemoryRouter>` (`TextLink`, `AuthFooter`, forms that include footer links).
4. **Wrap react-hook-form-dependent components** in a local wrapper component that calls `useForm` and passes the `registration` prop.
5. **Use Portuguese** for `describe`/`it` strings to match the rest of the test suite.

#### What automated tests cover (detectable in jsdom)

| WCAG criterion | What axe checks |
|---|---|
| 1.1.1 Non-text Content | `alt` on images; labels on inputs |
| 1.3.1 Info and Relationships | Semantic structure; `<label>` associated to controls |
| 3.3.2 Labels or Instructions | Every form control has an accessible name |
| 4.1.2 Name, Role, Value | Buttons and links have names; ARIA attributes are valid |
| 4.1.3 Status Messages | Error spans use `role="alert"` |

#### What automated tests cannot cover (requires browser tools)

These criteria need Lighthouse / axe DevTools / WAVE in a real browser:

| WCAG criterion | Why jsdom cannot check it |
|---|---|
| 1.4.3 Contrast (Minimum) | jsdom does not compute CSS — Tailwind color tokens are never resolved |
| 1.4.11 Non-text Contrast | Same reason |
| 2.4.7 Focus Visible | Focus ring styles require a real rendering engine |
| 2.1.1 Keyboard | Requires actual keyboard events in a browser |
| 1.4.4 Resize Text | Requires browser zoom |

> Run Lighthouse (`pnpm web:dev` → DevTools → Lighthouse → Accessibility) or the axe browser extension after any visual or layout change to catch contrast and focus issues not covered by unit tests.

### Style and color guidelines (`apps/web`)

This project uses **Tailwind CSS v4**. Tokens are defined in `apps/web/src/index.css` inside the `@theme` block — there is no `tailwind.config.js`.

#### Tokens and design system

Custom tokens live in `src/index.css` under `@theme` and follow Tailwind v4 namespace conventions:

| CSS variable prefix | Generates utility | Example |
|---|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*` | `--color-primary` → `bg-primary` |
| `--container-*` | `max-w-*` | `--container-auth-card` → `max-w-auth-card` |
| `--radius-*` | `rounded-*` | `--radius-card` → `rounded-card` |
| `--font-*` | `font-*` | `--font-sans` → applied via `font-family` |

**Colors** — always use semantic color tokens, never raw hex values in class names:
- `bg-bg` / `bg-card` — page and card backgrounds
- `text-foreground` — primary text
- `text-muted` — secondary/helper text
- `text-primary` / `bg-primary` — brand accent (green)
- `border-input-border`, `bg-input-bg`, `text-input-text` — form inputs

#### Tailwind utility rules

- **No arbitrary values** — never use `text-[15px]`, `w-[400px]`, `h-[32px]`, `left-[-89%]`, etc.
- **No hardcoded `px` or `%`** in class names.
- Use standard Tailwind scale tokens (`text-sm`, `text-lg`, `w-96`, `h-10`, `max-w-sm`…). When no exact token matches, pick the closest one.
- If a value has no reasonable standard token (e.g. a one-off layout dimension), define it as a named token in `@theme` and use that token class.
- **Measurement tokens must use `rem`**, never `px` — e.g. `--container-auth-card: 62.25rem` (996 ÷ 16), not `996px`.

**Font size reference** (closest standard tokens):

| Target size | Token | Rendered size |
|---|---|---|
| ~12–13 px | `text-xs` | 12 px |
| ~14–15 px | `text-sm` | 14 px |
| 16 px | `text-base` | 16 px |
| 18 px | `text-lg` | 18 px |
| ~20–21 px | `text-xl` | 20 px |
| ~22–23 px | `text-2xl` | 24 px |
| ~28–31 px | `text-3xl` | 30 px |

#### Layout and images

- **Flexbox-driven heights** — prefer `items-stretch` + `h-full` on children over hardcoded height values. Let content determine height.
- **Image cropping** — use `object-cover` (and optionally `object-position`) inside an `overflow-hidden` container. Never use percentage-based absolute positioning (`w-[248%] left-[-89%]`) to simulate a crop.

### Backend — NestJS (`apps/api`)

- **REST adherence**:
  - Resource-oriented URLs — nouns, not verbs (`/posts`, `/users/:id`, not `/getPosts`)
  - Correct HTTP verbs: `GET` (read), `POST` (create), `PUT/PATCH` (update), `DELETE` (remove)
  - Meaningful HTTP status codes: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `422`, `500`
  - Consistent JSON response shape; use NestJS `@HttpCode()` and exception filters
  - Stateless requests — no server-side session state
- **Module pattern**: each resource gets a Module + Controller + Service triple; wire into `AppModule`
- **Tests**: unit tests live alongside source as `*.spec.ts`; e2e tests are in `apps/api/test/`
