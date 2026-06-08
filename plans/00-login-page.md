# Plano: Página de Login (`apps/web`)

## Context

O `apps/web` é hoje um scaffold Vite + React 19 zerado (apenas o counter de exemplo). Precisamos entregar a página `/login` seguindo o layout em anexo: card centralizado em fundo escuro, com banner à esquerda e formulário à direita, botão primário verde, login social (GitHub + Gmail) e footer com link para cadastro.

Como a página de **cadastro virá depois** com o mesmo layout base (banner diferente, formulário diferente), toda a estrutura precisa ser pensada para reuso: o **template** (`AuthTemplate`) e os átomos/moléculas/organismos do formulário devem servir aos dois contextos sem refator.

Decisões já alinhadas com o usuário:
- **Tailwind v4** (via `@tailwindcss/vite`, tema no `index.css` com `@theme`)
- **react-hook-form + zod** para o formulário
- **React Router** instalado e configurado, mas só a rota `/login` no escopo agora
- **Vitest + Testing Library** configurado, com `*.test.tsx` ao lado de cada componente (exigência do CLAUDE.md)

---

## 1. Setup (comandos a partir da raiz do monorepo)

```bash
# runtime
pnpm --filter web add react-router-dom react-hook-form zod @hookform/resolvers

# tailwind v4
pnpm --filter web add -D tailwindcss @tailwindcss/vite

# testes
pnpm --filter web add -D vitest @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  jsdom @types/jsdom
```

---

## 2. Configuração

### `apps/web/vite.config.ts`
Adicionar plugin do Tailwind e bloco `test` do Vitest:
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
```

### `apps/web/package.json` (scripts)
Adicionar: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`.
(A raiz já expõe `pnpm web:test`/`pnpm web:test:watch` apontando para esses.)

### `apps/web/tsconfig.app.json`
`types`: adicionar `"vitest/globals"` e `"@testing-library/jest-dom"` ao lado do `"vite/client"`.

### `apps/web/src/test/setup.ts` (novo)
```ts
import '@testing-library/jest-dom/vitest'
```

### `apps/web/src/index.css` (rewrite)
Tailwind v4 + tokens do tema (cores do brand, raio, fonte). Cores aproximadas do layout: fundo `#0A0A0A`, card `#171717`, primary lime `#BFFF6B`, texto `#F5F5F5`, muted `#A3A3A3`. Remover `App.css` e o `index.css` atual.

---

## 3. Estrutura de arquivos

```
apps/web/src/
├── main.tsx                              [modify] RouterProvider
├── App.tsx / App.css                     [delete]
├── index.css                             [rewrite] Tailwind v4 + @theme
├── router.tsx                            [new]    /  →  /login
├── test/setup.ts                         [new]
├── lib/schemas/login.schema.ts           [new]    zod
├── components/
│   ├── atoms/        Button, Input, Label, Checkbox, TextLink, Icon
│   ├── molecules/    FormField, SocialButton, RememberMeRow, Divider, AuthFooter
│   ├── organisms/    LoginForm, SocialLoginGroup
│   └── templates/    AuthTemplate
└── pages/LoginPage/LoginPage.tsx
```

Cada componente em sua própria pasta com `Componente.tsx`, `Componente.test.tsx` e `index.ts` (barrel).

---

## 4. Componentes — responsabilidade e reuso

### Átomos
- **Button** — `variant: 'primary' | 'ghost'`, `rightIcon?: ReactNode`. Reuso: botão "Cadastrar →" do cadastro.
- **Input** — `forwardRef`, prop `invalid`. Reuso: todos os campos do cadastro.
- **Label** — wrapper de `<label>` com `htmlFor` tipado.
- **Checkbox** — `forwardRef`, estilizado com `accent-primary`. Reuso: "Aceito os termos" do cadastro.
- **TextLink** — wraps `<Link>` do Router; `tone: 'default' | 'primary' | 'muted'`.
- **Icon** — renderiza `<img>` para SVGs de `/public`.

### Moléculas
- **FormField** — Label + Input + erro. Aceita `register: UseFormRegisterReturn` do RHF. Reuso: cadastro inteiro.
- **SocialButton** — tile escuro com ícone centralizado e label embaixo. Reuso: idêntico no cadastro.
- **RememberMeRow** — Checkbox + Link "Esqueci a senha".
- **Divider** — `<hr/> {children} <hr/>`. Reuso: "ou cadastre-se com" no cadastro.
- **AuthFooter** — `question`, `linkText`, `to`, `icon?`. Reuso: cadastro passa "Já tem conta?" / "Faça login".

### Organismos
- **LoginForm** — usa `useForm<LoginFormValues>` com `zodResolver(loginSchema)`. Renderiza heading, subtítulo, FormFields, RememberMeRow, Button, Divider, SocialLoginGroup, AuthFooter. `onSubmit` faz apenas `console.log(values)`. Sem layout — quem layoutia é o template.
- **SocialLoginGroup** — dois `SocialButton` (GitHub + Gmail) usando `/github.svg` e `/google.svg`. Emite `onProvider(provider)`. Reuso: drop-in no cadastro.

### Template
- **AuthTemplate** — props:
  ```ts
  type AuthTemplateProps = {
    banner: { desktop: string; tablet: string; mobile: string; alt: string }
    children: ReactNode
  }
  ```
  Outer `min-h-screen bg-bg flex items-center justify-center`. Card `max-w-[1100px] bg-card rounded-card grid md:grid-cols-2 overflow-hidden`. Coluna esquerda: `<picture>` com `<source media>` desktop/tablet + fallback mobile, `hidden md:block` (em telas pequenas só mostra o formulário). Coluna direita: `p-8 md:p-12`, renderiza `children`. Reuso: cadastro só troca o `banner` e o `children`.

### Página
- **LoginPage** — instancia `AuthTemplate` com banner `/banner-login-{desktop,tablet,mobile}.png` e `<LoginForm />` como filho.

---

## 5. Schema zod (`lib/schemas/login.schema.ts`)

```ts
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Informe seu email ou usuário'),
  password: z.string().min(1, 'Informe sua senha'),
  rememberMe: z.boolean(),
})
export type LoginFormValues = z.infer<typeof loginSchema>
```

---

## 6. Roteamento

`src/router.tsx`:
```ts
createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
])
```
`main.tsx` envolve com `<RouterProvider router={router} />`.

---

## 7. Responsividade

- **Desktop (≥1024px)**: card 2 colunas, banner desktop.
- **Tablet (640–1023px)**: card 2 colunas, banner tablet via `<source media>`.
- **Mobile (<640px)**: coluna do banner escondida (`hidden md:block`), formulário ocupa toda a largura. Banner mobile fica wired no `<picture>` para troca futura de comportamento (stack) em uma linha.

---

## 8. Plano de testes (resumo)

Cada componente tem teste com: renderiza, reflete prop principal, dispara interação crítica. Destaques:
- **Button**: render, onClick, disabled, rightIcon.
- **Input**: placeholder, ref forwarding, `aria-invalid`, digitar valor.
- **FormField**: associação label↔input via `htmlFor`/`id`, exibição de erro.
- **LoginForm**: submit vazio → erros do zod aparecem; submit preenchido → `console.log` chamado com os valores (spy em `console.log`).
- **AuthTemplate**: 3 `<source>`s no `<picture>`, alt no `<img>`, filhos renderizados na coluna direita.
- **LoginPage**: smoke (renderiza heading "Login" e alt do banner). Envolver em `<MemoryRouter>` onde houver `<Link>`.

---

## 9. Verificação

```bash
pnpm web:dev                    # abre em http://localhost:5173
                                # / redireciona para /login
pnpm web:test                   # todos os testes verdes
pnpm --filter web lint
pnpm web:build                  # type-check + build de produção
```

Checks manuais no browser:
1. Fundo escuro, card centralizado, banner à esquerda em ≥1024px.
2. Resize para <640px → banner some, formulário ocupa o card.
3. Submit vazio → mensagens de erro inline nos dois campos.
4. Preencher campos + Login → console mostra `{ identifier, password, rememberMe }`.
5. Checkbox "Lembrar-me" alterna estado.
6. Ícones do GitHub/Google aparecem nos tiles sociais.
7. Link "Crie seu cadastro!" presente (rota ainda não existe, mas o link está montado).

---

## 10. Riscos / pontos de atenção

- **Tailwind v4 + Vite 8**: `@tailwindcss/vite` suporta Vite ≥5; v8 é forward-compatível. Se houver erro do plugin, fallback é `@tailwindcss/postcss` + `postcss.config.js`.
- **`verbatimModuleSyntax: true`** no tsconfig: imports de tipo (`ReactNode`, `InputHTMLAttributes`, etc.) precisam usar `import type`.
- **React 19 StrictMode + RHF**: usar `react-hook-form@^7.54` (clean com R19).
- **CSS reset**: preflight do Tailwind v4 vem com `@import "tailwindcss";` — remover `App.css` e o `index.css` antigo para evitar conflito de especificidade.

---

## Arquivos críticos
- `apps/web/vite.config.ts`
- `apps/web/src/index.css`
- `apps/web/src/main.tsx` + `src/router.tsx`
- `apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx`
- `apps/web/src/components/organisms/LoginForm/LoginForm.tsx`
- `apps/web/src/pages/LoginPage/LoginPage.tsx`
