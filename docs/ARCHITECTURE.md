# ARCHITECTURE — Arquitetura de software

## Visão geral

A plataforma GWDC segue uma arquitetura **híbrida estática + SPA**:

- **Website institucional** — gerado estaticamente no build (SSG, 43 páginas) pelo Next.js,
  servido via CDN com latência mínima e zero custo por requisição.
- **MVPs** — Single Page Application (Client Components) com dados simulados em `src/data/`,
  sessão local e navegação client-side.
- **Camada de IA** — funções determinísticas em `src/lib/ai.ts` (mock), com contratos estáveis
  para substituição futura por provedores externos (OpenAI/Anthropic) via API.

```
┌─────────────────────────────────────────────────────────────┐
│                        Cliente                             │
│   Browser (Next.js React) · Responsivo · Tema claro/escuro │
└───────────────┬─────────────────────────────────────────────┘
                │ HTTP/HTTPS
┌───────────────▼─────────────────────────────────────────────┐
│                  Gateway (NGINX / Vercel)                   │
│   TLS · Compressão · Cache de estáticos · Rate limit        │
└───────────────┬─────────────────────────────────────────────┘
┌───────────────▼─────────────────────────────────────────────┐
│                     Aplicação (Next.js)                     │
│  SSG (marketing)  ·  MVPs client-side ·  IA (lib/ai)        │
└───────┬───────────────┬───────────────┬─────────────┬───────┘
        │               │               │             │
┌───────▼─────┐ ┌───────▼─────┐ ┌───────▼─────┐ ┌─────▼──────────┐
│ PostgreSQL  │ │  MongoDB    │ │   Redis     │ │ RabbitMQ/ES    │
│ dados       │ │ documentos  │ │ cache/filas │ │ eventos/busca  │
│ estruturais │ │ não-        │ │             │ │                │
│             │ │ estruturados│ │             │ │                │
└─────────────┘ └─────────────┘ └─────────────┘ └────────────────┘
```

## Estrutura de pastas (visão funcional)

```
src/
├── app/                    # Rotas (App Router)
│   ├── (marketing)/        # Website institucional (SSG)
│   └── (dashboard)/        # MVPs autenticados (client)
├── components/
│   ├── ui/                 # Design System (20+ componentes)
│   ├── layout/             # Navbar, Footer
│   ├── marketing/          # Seções do site institucional
│   ├── dashboard/          # Shell, MvpView, seções especiais
│   └── ai/                 # Assistente virtual (chat)
├── data/                   # Fonte única de dados (products, mvp/*, content)
├── lib/                    # Branding, utils, IA, auth simulado
└── app/layout.tsx          # Root layout + temas + fontes
```

## Fluxos principais

### 1. Navegação institucional (SSG)
`getStaticProps`-equivalente (build): `src/data/products.ts` → páginas `/produtos/[slug]`,
`/mvps/[slug]`, blog `/blog/[slug]`. Todas estáticas; atualizações requerem novo build.

### 2. Login e sessão (simulada)
`src/lib/mvp/auth.ts` — `signIn` valida no cliente (qualquer e-mail + senha ≥ 6, ou
`demo@gwdc.gw`/`demo1234`), grava sessão no localStorage com expiração. `RequireAuth` em
`src/components/dashboard/shell.tsx` redireciona `/login` quando ausente.

### 3. Renderização de MVPs
`MvpView` (`src/components/dashboard/mvp-view.tsx`) consome `getMvpData(slug)`:
KPI cards → alertas → gráficos (Recharts) → tabela → seções extras (condicionais por produto).

### 4. IA (determinística)
`src/lib/ai.ts` implementa contratos estáveis: `extractDocumentInfo` (OCR), `translateText`,
`summarizeDocument`, `detectFraud`, `predictSeries`, `getRecommendations`, `semanticSearch`.
O chat (`src/components/ai/assistant.tsx`) chama essas funções com intenção reconhecida por
palavras-chave — substituível por LLM real mantendo as mesmas assinaturas.

## Modelos de dados (resumo)

| Entidade | Fonte | Campos principais |
| --- | --- | --- |
| Product | `src/data/products.ts` | slug, name, category, icon, status, kpis, funcionalidades, fluxo, métricas |
| MvpData | `src/data/mvp/*.ts` | kpis, alerts, trendData, table, section (opcional) |
| Solution | `src/data/solutions.ts` | vertical, problema → transformação, benefícios, produtos |
| Content | `src/data/content.ts` | parceiros, depoimentos, blog posts, vagas |

## Decisões técnicas (ADR resumido)

| Decisão | Alternativa rejeitada | Motivo |
| --- | --- | --- |
| SSG + Client MVPs | SSR completo | Custo zero de render, entrega imediata |
| `output: "standalone"` | `next start` em container | Imagem 10× menor, sem Node de build no runtime |
| Dados em TS (tipado) | CMS/BD no v1 | Velocidade de entrega, type-safety, MVP navegável offline |
| Tema CSS vars + dark mode | Tailwind apenas | Troca instantânea, design tokens reutilizáveis |
| IA mock determinística | LLM em produção | Demo sempre funcional, contratos estáveis para evolução |

## Segurança

- Headers de segurança no `next.config.ts` (X-Frame-Options, nosniff, Referrer-Policy, CSP)
- Nenhum segredo em código; `.env` fora do repositório; Secret k8s com SOPS/SealedSecrets
- `runAsNonRoot` + read-only filesystem nos containers; probes de saúde no k8s
- Rate limiting no NGINX; validação de entrada em toda futura API
