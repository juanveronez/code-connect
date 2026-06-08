# Plano: Correção de Inconsistências Design × Código

Levantamento feito comparando o código atual com os nós do Figma:
- Login: `node-id=155-3785`
- Cadastro: `node-id=155-3469`
- Arquivo: `bf3xF1Mak7BbdYLJ4lJ38c`

---

## 1. Tokens de design — `src/index.css` + `index.html`

### `index.html`
- Adicionar preconnect e link do Google Fonts para a fonte **Prompt** (weights 400 e 600)

### `src/index.css`

| Token | Atual | Correto (Figma) | Observação |
|-------|-------|-----------------|------------|
| `--color-bg` | `#0a0a0a` | `#00090e` | Grafite |
| `--color-card` | `#171717` | `#171d1f` | Cinza Escuro |
| `--color-primary` | `#bfff6b` | `#81fe88` | Verde destaque — cor completamente errada |
| `--color-foreground` | `#f5f5f5` | `#e1e1e1` | Offwhite |
| `--color-muted` | `#a3a3a3` | `#888888` | Cinza médio |
| `--color-input-bg` | `#262626` | `#888888` | Inputs têm fundo cinza médio no Figma |
| `--color-input-border` | `#404040` | `#888888` | |
| `--radius-card` | `1rem` (16px) | `2rem` (32px) | |
| `--font-sans` | `system-ui, ...` | `'Prompt', system-ui, ...` | Fonte principal do projeto |
| `--color-primary-fg` | ausente | `#132e35` | NOVO — Verde petróleo, texto sobre botão primário |
| `--color-input-text` | ausente | `#171d1f` | NOVO — texto escuro dentro do input (fundo cinza exige contraste) |

---

## 2. Átomo `Input` — `src/components/atoms/Input/Input.tsx`

- `rounded-lg` (8px) → `rounded` (4px)
- `py-3` (12px) → `py-2` (8px)
- `text-sm` (14px) → `text-[15px]`
- `text-foreground` → `text-input-text` (`#171d1f`) — texto escuro sobre fundo cinza
- `placeholder:text-muted` → `placeholder:text-input-text/60` — placeholder escuro sobre fundo cinza
- Borda padrão: substituir `border` por `border border-transparent` para evitar layout shift; manter `focus:border-primary` e `border-red-500` no estado de erro

---

## 3. Átomo `Label` — `src/components/atoms/Label/Label.tsx`

- `text-sm font-medium` → `text-lg font-normal` (18px Regular — Paragraph no Figma)

---

## 4. Átomo `Button` — `src/components/atoms/Button/Button.tsx`

- `text-sm` → `text-lg` (18px)
- Variante primary: `text-[#0a0a0a]` → `text-primary-fg` (`#132e35`)

---

## 5. Átomo `TextLink` — `src/components/atoms/TextLink/TextLink.tsx`

- Remover `text-sm` fixo — deve herdar o tamanho do contexto pai

---

## 6. Átomo `Checkbox` — `src/components/atoms/Checkbox/Checkbox.tsx`

- `border-input-border` continuará resolvendo para `#888888` após atualização do token — sem mudança no componente, mas validar visualmente

---

## 7. Molécula `Divider` — `src/components/molecules/Divider/Divider.tsx`

- `text-xs` (12px) → `text-[15px]` (Paragraph Small no Figma)

---

## 8. Molécula `SocialButton` — `src/components/molecules/SocialButton/SocialButton.tsx`

- Remover: `bg-social-bg`, `border border-input-border`, `px-6 py-4`, `rounded-lg`, `flex-1`, `hover:border-primary/50`
- Manter: ícone + label empilhados verticalmente (`flex flex-col items-center gap-1`)
- Ícone: tamanho 32px (GitHub) e 28px (Google) conforme Figma
- Label: `text-[12.5px]` (Label no Figma)
- Hover: `hover:opacity-80`

---

## 9. Molécula `AuthFooter` — `src/components/molecules/AuthFooter/AuthFooter.tsx`

- `text-sm` → `text-[15px]` (Paragraph Small no Figma)

---

## 10. Organismo `LoginForm` — `src/components/organisms/LoginForm/LoginForm.tsx`

- Heading: `text-2xl font-bold` → `text-[31px] font-semibold`
- Subtítulo texto: `"Bem-vindo de volta! Por favor, insira seus dados."` → `"Boas-vindas! Faça seu login."`
- Subtítulo classe: `text-sm text-muted` → `text-[22px] text-foreground`
- Divider: `"ou entre com"` → `"ou entre com outras contas"`
- Footer question: `"Não tem uma conta?"` → `"Ainda não tem conta?"`
- Footer `to="/signup"` → `to="/register"`

---

## 11. Template `AuthTemplate` — `src/components/templates/AuthTemplate/AuthTemplate.tsx`

- `max-w-[1100px]` → `max-w-[996px]`
- Estrutura: substituir `grid md:grid-cols-2 overflow-hidden` por `flex items-center justify-between`
- Padding do card: adicionar `px-20 py-14` (≈ 78px/56px do Figma)
- Imagem: remover `overflow-hidden` e `object-cover h-full`; imagem deve ser contida dentro do padding (`max-w-[407px] w-full h-auto`)
- Coluna do form: adicionar `px-8` extra (≈ 32px do Figma)
- Borda: adicionar `border border-bg` no card (Figma tem borda da mesma cor do fundo, criando profundidade sutil)
- Manter responsividade: `hidden md:block` na coluna da imagem
