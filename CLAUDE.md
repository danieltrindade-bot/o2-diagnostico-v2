# O2 Diagnostico v2

Plataforma de diagnóstico financeiro e calculadoras de precificação para consultores da O2 Inc.

## Stack

- **React 19** + **TypeScript 5.8** (strict)
- **Vite 7** com TanStack Router (file-based routing, code-splitting automático)
- **Tailwind CSS 4** com tokens OKLch em `src/styles.css`
- **shadcn/ui** (estilo `new-york`, sem RSC) — componentes em `src/components/ui/`
- **Radix UI** para primitivos acessíveis
- **TanStack React Query** para cache de dados (stale time 5min)
- **localStorage** como persistence layer (seed versionado em `src/lib/seed-data.ts`)
- **jsPDF** para exportação de PDFs (lazy-loaded)
- **lucide-react** para ícones
- **Deploy:** Vercel (SPA rewrite)

## Estrutura

```
src/
├── routes/          # Páginas (file-based routing)
├── components/
│   ├── ui/          # shadcn/ui base components (13)
│   └── admin/       # CRUD tabs do painel admin
├── context/         # AuthContext, DiagnosticContext
├── hooks/           # use-pricing.ts (React Query hooks)
└── lib/             # Utilitários, local-store, seed-data, pdf-export
```

## Design System

### Tema: dark padrão com suporte a light mode

O app usa dark mode como padrão (`data-theme="dark"` no `<html>`). Light mode existe via `[data-theme="light"]`.

### Cores (Hex — definidas em `src/styles.css` como CSS variables)

| Token              | Dark                        | Light              | Uso                 |
|--------------------|-----------------------------|--------------------|---------------------|
| `--background`     | `#3A3A3A`                   | `#FBFBFA`          | Fundo principal     |
| `--foreground`     | `#FAFAFA`                   | `#111111`          | Texto principal     |
| `--primary`        | `#63F161` (Lima 400)        | `#00D842` (Lima 500) | CTAs, destaque    |
| `--card`           | `#2E2E2E`                   | `#FFFFFF`          | Cards e superfícies |
| `--secondary`      | `#4A4A4A`                   | `#F4F4F3`          | Fundos secundários  |
| `--muted-foreground`| `#9A9A9A`                  | `#888888`          | Texto secundário    |
| `--border`         | `rgba(255,255,255,0.10)`    | `rgba(0,0,0,0.08)` | Bordas             |
| `--destructive`    | `#EF4444`                   | `#EF4444`          | Erros              |

Tokens extras do design system: `--bg-elev`, `--bg-elev-2`, `--border-strong`, `--fg-subtle`, `--fg-muted`, `--accent-soft`.

Status: `--success` (verde), `--warning` (amarelo), `--alert` (laranja), `--critical` (vermelho).

**REGRA DE CONTRASTE:** Lima 400 `#63F161` só em fundo escuro. Lima 500 `#00D842` só em fundo claro.

### Tipografia

| Função | Família | Variável CSS | Origem |
|--------|---------|--------------|--------|
| **Display** (títulos, h1–h4) | Tusker Grotesk | `--font-display` | Self-hosted em `public/fonts/tusker-grotesk/` |
| **Body** (parágrafos, UI, botões) | Montserrat | `--font-sans` | Google Fonts |
| **Mono** (eyebrows, valores, metadados) | JetBrains Mono | `--font-mono` | Google Fonts |

Fallbacks de display: Anton + Barlow Condensed.

- Títulos h1–h4 herdam `font-display uppercase font-weight:700 letter-spacing:0.005em` do CSS base
- Eyebrows: `font-mono text-[11px] tracking-[0.14em] uppercase`
- Chips: `font-mono text-[11px] tracking-[0.08em] uppercase`

### Radius

```
--radius-sm: 6px   --radius-md: 8px   --radius-lg: 12px (padrão)
--radius-xl: 16px  --radius-2xl: 20px
```

Cards usam `rounded-2xl` (20px). Inputs usam o radius padrão do shadcn.

### Componentes shadcn disponíveis

Button (6 variantes), Input, CurrencyInput (BRL), Label, Textarea, Select, RadioGroup, Checkbox, Progress, Slider, Tabs, Tooltip, Skeleton.

Config em `/components.json`. Para adicionar novos: `npx shadcn@latest add <componente>`.

### Padrões visuais

- Cards: `rounded-2xl border border-border bg-card p-7` (28px padding)
- Card selecionado: `border-primary shadow-[0_0_0_1px_var(--color-primary)]`
- Seções: separadas por `<div className="my-5 border-t border-border" />`
- Badge/tag (chip): `rounded-full bg-[var(--bg-elev)] border border-[var(--border)] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase`
- Destaque de valor: `rounded-xl bg-primary/15 border border-primary p-4`
- Eyebrow: `font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--fg-subtle)]`
- Botões: pill shape (`rounded-full`), padding `h-10 px-5`, `font-semibold`
- Texto de apoio: `text-sm text-muted-foreground`
- Ícones: `h-4 w-4` (inline) ou `h-5 w-5` (em cards)
- Easing: `var(--ease)` = `cubic-bezier(0.2, 0.8, 0.2, 1)` — usar em todas as transições

### Animações (definidas em `src/styles.css`)

- `kenburns` — zoom na hero
- `fadeSlideUp` — entrada de elementos
- `float` — flutuação suave
- `dashFlow` — animação de traço SVG

## Convenções de código

- **Idioma do código:** inglês (variáveis, componentes, commits)
- **Idioma da UI:** português brasileiro
- Path alias: `@/*` → `./src/*`
- Formatação: Prettier (100 chars, double quotes, trailing commas)
- Classes condicionais: usar `cn()` de `@/lib/utils`
- Moeda: usar `formatBRL()` de `@/lib/format` — nunca formatar manualmente
- Ícones: apenas `lucide-react` — não adicionar outras libs de ícones

## Routing

TanStack Router com file-based routes em `src/routes/`. A route tree é gerada automaticamente (`routeTree.gen.ts` — não editar manualmente).

Rotas principais:
- `/` — Landing page
- `/diagnostico` — Fluxo de diagnóstico (3 telas)
- `/resultados` — Resultados do diagnóstico
- `/servicos` — Lista de serviços
- `/calculadora/{bpo,cfo,oxy,coordenador,assessoria}` — Calculadoras de preço
- `/admin/login` e `/admin` — Painel administrativo (protegido)

## Dados e persistência

Toda persistência é via **localStorage** com wrapper em `src/lib/local-store.ts`:
- `selectAll<T>(table, orderBy?)` — leitura
- `insertRows(table, rows)` — inserção
- `updateRow(table, id, data)` — atualização
- `deleteRow(table, id)` — remoção
- `resetTable(table)` — volta ao seed

Seed data versionado em `src/lib/seed-data.ts` (SEED_VERSION = 4). Ao incrementar a versão, todos os dados são resetados no próximo carregamento.

## Comandos

```bash
npm run dev      # Dev server (Vite)
npm run build    # Build para produção
npm run lint     # ESLint
npm run format   # Prettier
npx vitest       # Testes
```

## Regras importantes

- Nunca introduzir vulnerabilidades de segurança (XSS, injection, etc.)
- Não commitar secrets, tokens ou chaves de API
- Manter o tema dark — não adicionar light mode
- Valores financeiros sempre formatados via `formatBRL()`, nunca hardcoded
- Componentes de UI novos devem seguir o padrão shadcn/ui existente
- Não adicionar dependências desnecessárias — o bundle já é grande (jsPDF = 772KB)
- Testes devem acompanhar mudanças em lógica de negócio (`lib/`)
