# PROJECT-STRUCTURE — Estrutura de diretórios

```
GWDC1/
├── src/
│   ├── app/                         # Rotas (Next.js App Router)
│   │   ├── (marketing)/             # ── Website institucional (SSG) ──
│   │   │   ├── page.tsx             #   Home
│   │   │   ├── sobre/               #   Sobre nós
│   │   │   ├── solucoes/            #   Soluções por vertical
│   │   │   ├── produtos/
│   │   │   │   └── [slug]/          #   18 páginas de produto
│   │   │   ├── mvps/
│   │   │   │   └── [slug]/          #   Páginas de apresentação dos MVPs
│   │   │   ├── parceiros/           #   Parceiros e depoimentos
│   │   │   ├── carreiras/           #   Vagas
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx         #   Lista de artigos
│   │   │   │   └── [slug]/          #   Artigo individual
│   │   │   ├── contato/             #   Formulário de contato
│   │   │   └── [vertical]/          #   8 verticais (governo-digital,
│   │   │                            #   educacao, saude, justica,
│   │   │                            #   banco-digital, empresas,
│   │   │                            #   transporte, meio-ambiente)
│   │   └── (dashboard)/             # ── MVPs autenticados ──
│   │       ├── login/page.tsx       #   Tela de login
│   │       ├── app/
│   │       │   └── [product]/       #   Dashboard de cada MVP
│   │       └── layout.tsx           #   Shell do dashboard
│   ├── components/
│   │   ├── ui/                      # Design System (Módulo 3)
│   │   │   ├── button.tsx, card.tsx, badge.tsx, input.tsx,
│   │   │   ├── table.tsx, modal.tsx, accordion.tsx, alert.tsx,
│   │   │   ├── breadcrumb.tsx, pagination.tsx, timeline.tsx,
│   │   │   ├── tabs.tsx, progress.tsx, avatar.tsx, skeleton.tsx,
│   │   │   ├── carousel.tsx, calendar.tsx, faq.tsx, charts.tsx
│   │   ├── layout/                  # navbar.tsx, footer.tsx
│   │   ├── marketing/               # seções home, vertical-page,
│   │   │                            #   product-page, solution-page
│   │   ├── dashboard/               # shell.tsx, mvp-view.tsx,
│   │   │                            #   sections.tsx, widgets.tsx
│   │   └── ai/                      # assistant.tsx (chat IA)
│   ├── data/                        # Fonte única de dados
│   │   ├── products.ts              #   18 produtos
│   │   ├── solutions.ts             #   8 verticais
│   │   ├── content.ts               #   parceiros, blog, vagas
│   │   └── mvp/                     #   dados dos dashboards
│   │       ├── index.ts             #   getMvpData(slug)
│   │       ├── governo.ts           #   GW-Docs, GW-ID, eProcura
│   │       ├── educacao.ts          #   GW-School, GW-Edu
│   │       ├── empresas.ts          #   GW-Biz, GW-Tax, eFatura
│   │       ├── financas.ts          #   GW-Bank, GW-Kubo, ePIX
│   │       ├── saude-justica.ts     #   GW-Health, GW-IMS, GW-Justica
│   │       ├── transporte-clima.ts  #   GW-Mobil, GW-Routes, GW-Energy
│   │       └── dados.ts             #   GW-Data, GW-AI, GW-Chat
│   ├── lib/
│   │   ├── branding.ts              # Marca: missão, visão, valores, tom de voz
│   │   ├── ai.ts                    # IA: OCR, tradução, fraude, predição, busca
│   │   ├── mvp/
│   │   │   └── auth.ts              # Sessão simulada (localStorage)
│   │   └── utils.ts                 # formatDate, formatNumber, cn
│   ├── app/layout.tsx               # Root layout (fontes, metadados, tema)
│   ├── app/globals.css              # Tokens da marca + tema claro/escuro
│   └── middleware.ts                # (futuro) proteção de rotas
├── tests/                           # Testes unitários (Vitest)
│   ├── ai.test.ts                   # 10 testes da camada de IA
│   └── utils.test.ts                # 5 testes de utilitários
├── nginx/nginx.conf                 # Gateway (Módulo 12)
├── monitoring/prometheus.yml        # Métricas (Módulo 12)
├── k8s/
│   ├── app.yaml                     # Deployment, Service, HPA, PDB, Ingress
│   └── kustomization.yaml
├── .github/workflows/ci.yml         # CI/CD (lint, typecheck, testes, build)
├── Dockerfile                       # Multi-stage (deps → build → runner)
├── docker-compose.yml               # web + gateway + postgres + mongo + redis +
│                                    #   rabbitmq + elasticsearch + kibana +
│                                    #   prometheus + grafana
├── .env.example                     # Variáveis de ambiente documentadas
├── next.config.ts                   # Config Next (standalone, headers)
├── package.json                     # Scripts e dependências
├── README.md                        # Visão geral (este documento)
└── docs/                            # Documentação completa
    ├── INSTALL.md · DEPLOY.md · API.md · ARCHITECTURE.md
    ├── PROJECT-STRUCTURE.md · MANUAL-USUARIO.md
    ├── MANUAL-ADMINISTRADOR.md · CONTRIBUTING.md · CHANGELOG.md
```
