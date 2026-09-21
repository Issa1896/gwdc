# CHANGELOG

Todas as mudanças relevantes da plataforma GW Digital Company.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versionamento semântico ([SemVer](https://semver.org/lang/pt-BR/)).

## [1.0.0] — 2026-07-31

Entrega inicial completa dos 15 módulos da plataforma.

### Adicionado
- **Módulo 1 — Branding:** missão, visão, valores, manifesto, história, posicionamento,
  tom de voz e identidade visual da GWDC
- **Módulo 2 — Website institucional:** Home, Sobre, Soluções, Produtos, MVPs, Parceiros,
  Carreiras, Blog, Contato e 8 verticais (Governo Digital, Educação, Saúde, Justiça,
  Banco Digital, Empresas, Transporte, Meio Ambiente)
- **Módulo 3 — Design System:** 20+ componentes UI (Botão, Card, Tabela, Modal, Acordeão,
  Gráficos, Calendário, FAQ, Carrossel, Timeline, Tabs e mais) com tema claro/escuro
- **Módulo 4 — Catálogo:** 18 produtos com objetivo, público-alvo, funcionalidades,
  fluxo, tecnologias, status e métricas
- **Módulo 5 — MVPs navegáveis:** login, dashboard com sidebar, seletor de produto,
  gráficos, tabelas, modo claro/escuro e responsividade
- **Módulos 6–11 — Dados por setor:** dashboards de Governo, Educação, Empresas, Finanças,
  Saúde/Justiça, Transporte/Clima e Dados
- **Módulo 12 — Arquitetura enterprise:** Dockerfile multi-stage, Docker Compose (10
  serviços: web, NGINX, PostgreSQL, MongoDB, Redis, RabbitMQ, Elasticsearch, Kibana,
  Prometheus, Grafana), manifestos Kubernetes (Deployment, HPA, PDB, Ingress, Secret),
  pipeline CI/CD (GitHub Actions) e gateway NGINX
- **Módulo 13 — Inteligência artificial:** assistente virtual, OCR, tradução, resumo,
  detecção de fraude, predição de séries, recomendações e pesquisa semântica
- **Módulo 14 — Documentação:** README, INSTALL, DEPLOY, API, ARCHITECTURE,
  PROJECT-STRUCTURE, manuais de usuário/administrador, CONTRIBUTING, CHANGELOG
- **Módulo 15 — Entrega final:** `.env.example`, estrutura documentada, checklist de
  qualidade e guias de publicação

### Corrigido
- `next start` com `output: "standalone"` (Dockerfile agora usa `node server.js`;
  instalação local usa `next start` — documentado em INSTALL.md)
- Datas em português (`formatDate` sem dependência de ICU)
- Tipagem de tooltip dos gráficos (Recharts 3)
- Serialização de ícones em páginas SSG (MVP em Client Component)
- Configuração ESLint ignorando `next-env.d.ts`

### Verificado
- Build de produção: 43 páginas estáticas geradas sem erros
- Lint ESLint: limpo
- Typecheck TypeScript estrito: limpo
- Testes unitários Vitest: 15/15 aprovados
- Smoke test HTTP: Home, Sobre, Produtos, Blog, MVPs, Login — todos 200 OK

## [0.9.0] — 2026-07-30 (pré-lançamento)

- Fundação do projeto: Next.js 15 + TypeScript estrito + Tailwind 4 + Design tokens
- Estrutura inicial de dados (produtos, verticais, conteúdo) e primeiros componentes UI
- Esqueleto dos MVPs e primeira versão da camada de IA
