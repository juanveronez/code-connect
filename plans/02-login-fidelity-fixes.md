# Plano: Ajuste fino da LoginPage para fidelidade ao Figma

## Contexto

A `LoginPage` e seus componentes já passaram por uma primeira rodada de correções
(commit `71e2343`, documentada em [01-design-token-fixes.md](./01-design-token-fixes.md)):
tokens de cor, fonte **Prompt**, tamanhos de fonte e cores de input já estão corretos.

Comparando o código atual com o nó do Figma `155:3785` (arquivo `bf3xF1Mak7BbdYLJ4lJ38c`),
o que **ainda destoa** é principalmente o **ritmo vertical (espaçamentos)** e alguns
detalhes de tipografia/cor, além de quatro extras de fidelidade aprovados pelo usuário
(ícones Material, checkbox customizado, texto do botão e fundo decorativo).

**Causa raiz do espaçamento:** o `LoginForm` usa um único `flex flex-col gap-6` (24px)
entre TODOS os elementos. O Figma usa uma hierarquia aninhada de gaps:

| Relação | Figma | Atual |
|---|---|---|
| Título "Login" ↔ subtítulo | 24px | `mb-1` (4px) ❌ |
| Bloco de cabeçalho ↔ campos | 40px | 24px ❌ |
| Campo email ↔ bloco senha | 16px | 16px ✓ |
| Campo senha ↔ "Lembrar-me/Esqueci" | 8px | 24px ❌ |
| Grupo (cabeçalho+campos) ↔ botão | 32px | 24px ❌ |
| Botão ↔ seção social | 32px | 24px ❌ |
| Divider ↔ botões sociais | 8px | 24px ❌ |
| Seção social ↔ rodapé | 24px | 24px ✓ |

---

## Mudanças — Núcleo (espaçamento, tipografia, cor)

### 1. `LoginForm` — reestruturar em hierarquia aninhada de gaps
[apps/web/src/components/organisms/LoginForm/LoginForm.tsx](../apps/web/src/components/organisms/LoginForm/LoginForm.tsx)

Substituir o `gap-6` plano por divs aninhadas que reproduzem o Figma. A `RememberMeRow`
deve ser **acoplada ao campo de senha** (8px), não ficar como irmã solta:

```tsx
<form className="flex flex-col gap-6">           {/* 24px: conteúdo principal ↔ rodapé */}
  <div className="flex flex-col gap-8">          {/* 32px: cabeçalho+campos ↔ botão ↔ social */}
    <div className="flex flex-col gap-10">       {/* 40px: bloco de cabeçalho ↔ campos */}
      <div className="flex flex-col gap-6">      {/* 24px: título ↔ subtítulo */}
        <h1 className="text-[31px] font-semibold text-foreground">Login</h1>
        <p  className="text-[22px] text-foreground">Boas-vindas! Faça seu login.</p>
      </div>
      <div className="flex flex-col gap-4">      {/* 16px: email ↔ grupo senha */}
        <FormField id="identifier" ... />
        <div className="flex flex-col gap-2">    {/* 8px: senha ↔ RememberMeRow */}
          <FormField id="password" ... />
          <RememberMeRow registration={register('rememberMe')} />
        </div>
      </div>
    </div>
    <Button type="submit" variant="primary" className="w-full" rightIcon={<MaterialIcon name="arrow_forward" />}>
      Login
    </Button>
    <div className="flex flex-col gap-2">        {/* 8px: divider ↔ botões sociais */}
      <Divider>ou entre com outras contas</Divider>
      <SocialLoginGroup />
    </div>
  </div>
  <AuthFooter question="Ainda não tem conta?" linkText="Crie seu cadastro!" to="/register"
              icon={<MaterialIcon name="assignment" />} />
</form>
```
- Remover o `mb-1` do `<h1>` (o gap do wrapper cuida disso).
- Texto do botão: `Entrar` → `Login` (extra aprovado).

### 2. `RememberMeRow` — tamanho e cor
[apps/web/src/components/molecules/RememberMeRow/RememberMeRow.tsx](../apps/web/src/components/molecules/RememberMeRow/RememberMeRow.tsx)
- Label "Lembrar-me": `text-sm` → `text-[15px]` (mantém `text-muted` = `#888`, confere com Figma).
- Link "Esqueci a senha": no Figma é **Offwhite `#e1e1e1`** (não cinza). Trocar `tone="muted"` → `tone="default"`. O `text-[15px]` será herdado do contexto (ver item 4).

### 3. `FormField` — gap label↔input
[apps/web/src/components/molecules/FormField/FormField.tsx](../apps/web/src/components/molecules/FormField/FormField.tsx)
- `gap-1.5` (6px) → `gap-2` (8px), conforme o átomo Input do Figma.

### 4. `SocialLoginGroup` + `Divider`
[apps/web/src/components/organisms/SocialLoginGroup/SocialLoginGroup.tsx](../apps/web/src/components/organisms/SocialLoginGroup/SocialLoginGroup.tsx)
- Grupo social: `gap-3` → `gap-6` (24px) e adicionar `justify-center`.

[apps/web/src/components/molecules/Divider/Divider.tsx](../apps/web/src/components/molecules/Divider/Divider.tsx)
- `gap-3` → `gap-4` (16px), conforme Figma. (Ajuste menor.)

### 5. `AuthFooter` — layout empilhado + tamanho do link
[apps/web/src/components/molecules/AuthFooter/AuthFooter.tsx](../apps/web/src/components/molecules/AuthFooter/AuthFooter.tsx)

No Figma o rodapé é **empilhado** (gap 8px), não inline:
- Pergunta "Ainda não tem conta?": `text-[15px]`, cor **`text-foreground`** (não `text-muted`), centralizada.
- Link "Crie seu cadastro!": `text-[18px]`, `tone="primary"` (verde `#81fe88`), com ícone à direita.

```tsx
<div className="flex flex-col gap-2 items-center text-center">
  <p className="text-[15px] text-foreground">{question}</p>
  <TextLink to={to} tone="primary" className="text-[18px] inline-flex items-center gap-3">
    {linkText}
    {icon}
  </TextLink>
</div>
```

---

## Mudanças — Extras de fidelidade (aprovados)

### 6. Ícones Material
- Adicionar ao `<head>` em [apps/web/index.html](../apps/web/index.html):
  `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />`
- Criar átomo `MaterialIcon` em `apps/web/src/components/atoms/MaterialIcon/` (+ `index.ts`, `MaterialIcon.test.tsx`):
  ```tsx
  type Props = { name: string; className?: string }
  export function MaterialIcon({ name, className = '' }: Props) {
    return <span aria-hidden className={`material-icons ${className}`}>{name}</span>
  }
  ```
- Usar `arrow_forward` no `Button` (via `rightIcon`, já suportado) e `assignment` no `AuthFooter` (via `icon`, já suportado).

### 7. Checkbox customizado
[apps/web/src/components/atoms/Checkbox/Checkbox.tsx](../apps/web/src/components/atoms/Checkbox/Checkbox.tsx)
- Manter `<input type="checkbox">` nativo (compatibilidade com `react-hook-form` via `register`), mas usar `appearance-none` para estilizar:
  - Caixa: `appearance-none size-6 rounded border-2 border-input-border bg-transparent cursor-pointer`
  - Estado marcado: `checked:bg-primary checked:border-primary` + check verde-petróleo (`#132e35`) desenhado via SVG embutido (`checked:bg-[url(...)] bg-center bg-no-repeat`).
- Ajustar `RememberMeRow` para alinhar o novo tamanho (24px) com o texto (`items-center`).

### 8. Fundo decorativo (símbolos de corrente)
[apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx](../apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx)
- Exportar o nó **"Símbolo"** (`155:3786`) do Figma como SVG e salvar em `apps/web/public/bg-symbol.svg`
  (o `favicon.svg` é o logo colorido, **não** serve — o fundo usa o contorno monocromático da marca).
- No container externo: adicionar `relative overflow-hidden`. Inserir 2 `<img src="/bg-symbol.svg">` posicionados absolutamente com `opacity-30 pointer-events-none` (canto inferior-direito e topo, ~407px de largura, como no Figma). Dar `relative z-10` ao card para ficar acima.

---

## Testes a atualizar
- `AuthFooter.test.tsx`: agora a pergunta e o link estão em elementos separados — ajustar queries se necessário.
- `LoginForm.test.tsx`: o botão muda de "Entrar" para "Login" — atualizar o seletor do botão de submit (cuidado para não colidir com o `<h1>` "Login"; usar `getByRole('button', { name: /login/i })`).
- Criar `MaterialIcon.test.tsx` (render + classe `material-icons` + nome).
- Conferir `Checkbox.test.tsx` e `RememberMeRow.test.tsx` após a mudança de estilo.

## Verificação
1. `pnpm web:test` — toda a suíte deve passar.
2. `pnpm --filter web lint` — sem erros.
3. `pnpm web:dev` e comparar visualmente `/login` com o screenshot do Figma (`155:3785`):
   ritmo vertical (24/32/40/16/8), "Esqueci a senha" claro, link do rodapé verde 18px,
   ícones de seta/assignment, checkbox com borda 2px e símbolos de fundo a 30%.
