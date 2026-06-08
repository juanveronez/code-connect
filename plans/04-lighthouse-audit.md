# Plano: Corrigir achados do Lighthouse na página /register

## Contexto

Foi rodado o Lighthouse contra `http://localhost:5173/register` (servidor de
desenvolvimento do Vite). As métricas de performance vieram ruins:

| Métrica | Valor | Score |
|---|---|---|
| First Contentful Paint | 2.0 s | 0.29 |
| Largest Contentful Paint | 3.8 s | 0.20 |
| Speed Index | 2.1 s | 0.58 |

**Causa raiz principal:** o banner da página é um PNG de **1344×896 e 1,4 MB**
(`public/banner-register-desktop.png`) renderizado dentro de um container de
`w-96` (~384 px) com `object-cover` — ou seja, ~3,5× maior que o tamanho exibido
e no formato errado (PNG para uma ilustração). Esse é o elemento de LCP e explica
o LCP de 3,8 s e o Speed Index alto. O `/login` tem o mesmo problema
(`banner-login.png`, 1,3 MB). Vamos corrigir os dois.

Além da imagem, há correções de correção/qualidade detectáveis pelo Lighthouse no
`index.html` (idioma e título) e no `AuthTemplate` (imagens decorativas).

> ⚠️ As métricas foram medidas no **dev server** do Vite, que não é
> representativo de produção. A baseline correta deve ser medida sobre o build
> de produção (ver seção de verificação). Mesmo assim, o banner de 1,4 MB é um
> problema real em qualquer ambiente.

## Mudanças

### 1. Otimizar os banners (maior impacto em LCP / Speed Index)

Converter os dois banners para **WebP redimensionado** para o tamanho de exibição
em telas retina (~768 px de largura, mantendo a proporção 3:2 → 768×512). Espera-se
reduzir de ~1,4 MB para ~40–80 KB cada.

- Rodar conversão one-off sem adicionar dependência permanente, via `npx sharp-cli`:
  - `public/banner-register-desktop.png` → `public/banner-register-desktop.webp` (768×512, quality ~80)
  - `public/banner-login.png` → `public/banner-login.webp`
- Manter os PNGs originais não é necessário; remover após confirmar que nada mais
  os referencia (`grep -rn banner-register-desktop\|banner-login src/`).
- Atualizar as referências em:
  - `apps/web/src/pages/RegisterPage/RegisterPage.tsx` → `src: '/banner-register-desktop.webp'`
  - A página de login equivalente em `apps/web/src/pages/LoginPage/` → `.webp`

### 2. Ajustes de imagem no AuthTemplate

Arquivo: `apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx`

- **Banner (LCP)** — adicionar atributos HTML (não são classes Tailwind, não
  violam a regra de “sem px em classes”) para priorizar o LCP e reservar espaço:
  `width={768} height={512} fetchPriority="high" decoding="async"`.
- **Imagens decorativas `bg-symbol.svg`** (linhas 16–25) — adicionar `alt=""` e
  `loading="lazy"` (já têm `aria-hidden`). Garante que o axe/Lighthouse não acuse
  imagem sem texto alternativo e evita baixá-las antes do conteúdo principal.
- **Logo** (linha 34) — adicionar `width={128} height={40}` (corresponde a
  `w-32 h-10`) como salvaguarda de CLS.

### 3. `index.html` — idioma e título

Arquivo: `apps/web/index.html`

- `lang="en"` → **`lang="pt-BR"`** (todo o conteúdo é português — WCAG 3.1.1).
- `<title>web</title>` → título descritivo, ex. **`Code Connect`** (corrige o audit
  `document-title` do Lighthouse).
- Adicionar `<meta name="description" content="...">` (best-practices/SEO).
- (Opcional) Título por rota: definir `document.title` via `useEffect` em
  `RegisterPage`/`LoginPage` se quisermos títulos distintos por página.

## Itens secundários / opcionais (menor impacto, inflados pelo dev server)

- **Render-blocking dos Google Fonts**: os dois `<link rel="stylesheet">` de fontes
  bloqueiam o render (afeta FCP). `display=swap` já mitiga FOIT. Opcional: técnica
  `media="print" onload="this.media='all'"` ou `<link rel="preload">`.
- **Code splitting de rotas**: hoje `router.tsx` importa `LoginPage` e
  `RegisterPage` de forma eager. Com `React.lazy` + `Suspense` reduz o bundle
  inicial. Ganho marginal com apenas 2 páginas — deixar como melhoria opcional.

## Arquivos modificados

- `apps/web/public/` — novos `*.webp`, remoção dos `*.png` de banner
- `apps/web/src/pages/RegisterPage/RegisterPage.tsx` e `LoginPage/` — referência `.webp`
- `apps/web/src/components/templates/AuthTemplate/AuthTemplate.tsx` — atributos de img
- `apps/web/index.html` — `lang`, `title`, `meta description`

## Verificação

1. **Testes existentes** continuam passando:
   - `pnpm web:test` (unit + a11y; verificar `AuthTemplate.test.tsx` e
     `RegisterPage` se referenciam o `src` do banner).
   - Conferir o console do `@axe-core/react` em `pnpm web:dev` (sem violações novas).
2. **Lighthouse sobre build de produção** (baseline confiável, não o dev server):
   ```bash
   pnpm web:build
   pnpm --filter web preview   # serve o dist/
   # rodar Lighthouse contra a URL do preview (/register e /login)
   ```
   Esperado: LCP e Speed Index caem significativamente; banner deixa de ser um
   recurso pesado; audits `document-title` e idioma passam.
3. Conferir visualmente que os banners `.webp` renderizam nítidos em /register e
   /login (incluindo telas retina) e que o logo continua posicionado corretamente.
