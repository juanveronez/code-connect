# Plano: Página de Cadastro (Register)

## Context

A aplicação `apps/web` já tem a página de Login (`LoginPage`) construída em Atomic Design e
totalmente conectada ao design do Figma. O design ([node 155-3469](https://www.figma.com/design/bf3xF1Mak7BbdYLJ4lJ38c/?node-id=155-3469))
inclui também a tela de **Cadastro**, que é praticamente idêntica à de Login. Falta
implementá-la. O objetivo é entregar a página `/register` com fidelidade ao design,
**reaproveitando ao máximo** os componentes atômicos já existentes (template, molecules e atoms
compartilhados entre Login e Cadastro).

Comparando o design de Cadastro com o `LoginForm` atual, as únicas diferenças são:

| Item | Login | Cadastro |
|------|-------|----------|
| Título | "Login" | **"Cadastro"** |
| Subtítulo | "Boas-vindas! Faça seu login." | **"Olá! Preencha seus dados."** |
| Campos | identifier, senha | **Nome** (ph "Nome completo"), **Email** (ph "Digite seu email"), **Senha** |
| Checkbox | "Lembrar-me" + link "Esqueci a senha" | **só "Lembrar-me"** (sem o link) |
| Botão | "Login" | **"Cadastrar"** (mesmo ícone `arrow_forward`) |
| Social | Divider + GitHub/Gmail | **igual** |
| Footer | "Ainda não tem conta? / Crie seu cadastro!" → `/register` (ícone `assignment`) | **"Já tem conta? / Faça seu login!"** → `/login` (ícone `login`) |

Decisões confirmadas com o usuário:
- **Banner**: baixar a ilustração do Figma e salvar como `banner-register-*.png`.
- **Validação**: Nome obrigatório, Email com formato válido (`.email()`), Senha mínimo 6 caracteres.

## Componentes reaproveitados (sem alteração)

- `templates/AuthTemplate` — layout de duas colunas + banner responsivo (`banner` prop).
- `molecules/FormField` — Label + Input + erro (`apps/web/src/components/molecules/FormField/FormField.tsx`).
- `molecules/Divider`, `organisms/SocialLoginGroup`, `molecules/AuthFooter`, `atoms/Button`,
  `atoms/MaterialIcon`, `atoms/Checkbox`.

## Mudanças

### 1. Asset do banner
Baixar a ilustração do Figma (asset `imgRectangle1726`:
`https://www.figma.com/api/mcp/asset/7906acc3-a514-4ceb-8eab-ff77e30b38cf`) e salvar em
`apps/web/public/`. Como o Figma só fornece uma resolução, salvar o mesmo arquivo nos três nomes
esperados pelo `AuthTemplate`:
- `banner-register-desktop.png`
- `banner-register-tablet.png`
- `banner-register-mobile.png`

### 2. Schema de validação — `apps/web/src/lib/schemas/register.schema.ts` (novo)
Espelhar o padrão de `login.schema.ts`:
```ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Informe seu nome'),
  email: z.string().min(1, 'Informe seu email').email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  rememberMe: z.boolean(),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
```

### 3. Organism — `apps/web/src/components/organisms/RegisterForm/` (novo)
`RegisterForm.tsx` + `index.ts`, espelhando `LoginForm.tsx`:
- `useForm<RegisterFormValues>` com `zodResolver(registerSchema)`, `defaultValues: { rememberMe: false }`.
- Título `<h1>` "Cadastro" e parágrafo "Olá! Preencha seus dados." (mesmas classes do LoginForm).
- 3× `FormField`: `name` (label "Nome", ph "Nome completo"), `email` (label "Email",
  ph "Digite seu email", `type="email"`), `password` (label "Senha", `type="password"`, ph "••••••••").
- Checkbox "Lembrar-me" **sem** o link "Esqueci a senha" — não dá para usar `RememberMeRow`
  (ele inclui o link). Inline o mesmo markup de label+Checkbox usado em `RememberMeRow` (linhas 12-15):
  ```tsx
  <label className="flex items-center gap-2 cursor-pointer text-[15px] text-muted">
    <Checkbox {...register('rememberMe')} />
    Lembrar-me
  </label>
  ```
- `Button` "Cadastrar" com `rightIcon={<MaterialIcon name="arrow_forward" />}`.
- `Divider` "ou entre com outras contas" + `SocialLoginGroup` (igual ao LoginForm).
- `AuthFooter` question="Já tem conta?" linkText="Faça seu login!" to="/login"
  icon={<MaterialIcon name="login" />}.
- `onSubmit` registra no console (mesmo placeholder do LoginForm).

### 4. Page — `apps/web/src/pages/RegisterPage/` (novo)
`RegisterPage.tsx` + `index.ts`, espelhando `LoginPage.tsx`:
```tsx
const banner = {
  desktop: '/banner-register-desktop.png',
  tablet: '/banner-register-tablet.png',
  mobile: '/banner-register-mobile.png',
  alt: 'Ilustração de cadastro',
}
// <AuthTemplate banner={banner}><RegisterForm /></AuthTemplate>
```

### 5. Rota — `apps/web/src/router.tsx`
Adicionar `{ path: '/register', element: <RegisterPage /> }` e o import de `RegisterPage`.
(O `LoginForm` já aponta o footer para `/register`, então o link passará a funcionar.)

### 6. Testes (Vitest + Testing Library, padrão do projeto)
- `RegisterPage.test.tsx` — renderiza heading "Cadastro" e o banner (`alt` "Ilustração de cadastro"),
  dentro de `<MemoryRouter>`.
- `RegisterForm.test.tsx` — (a) erros de validação ao submeter vazio
  ("Informe seu nome", "Email inválido"/"Informe seu email", senha curta);
  (b) submit válido chama `console.log` com `{ name, email, password, rememberMe: false }`.

## Verificação

```bash
pnpm web:test     # roda Vitest — novos testes de RegisterPage/RegisterForm devem passar
pnpm web:lint     # sem erros de lint
pnpm web:dev      # abrir /register e comparar com o screenshot do Figma
```
Conferir visualmente em `/register`: título, três campos com placeholders corretos, checkbox
"Lembrar-me" sem link, botão "Cadastrar", social login e footer "Já tem conta? / Faça seu login!"
levando a `/login`. Confirmar que o link "Crie seu cadastro!" do Login leva a `/register`.
