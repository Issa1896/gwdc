# GW Digital Company — Plataforma Digital

> **Tecnologia que transforma a Guiné-Bissau e conecta o futuro da África Ocidental.**

Plataforma completa da **GW Digital Company (GWDC)**: website institucional premium, ecossistema de
**18 produtos**, design system próprio, **MVPs navegáveis** com dados fictícios realistas, inteligência
artificial aplicada e arquitetura enterprise pronta para produção (Docker, Kubernetes, CI/CD,
monitoramento).

---

## ✨ O que está incluído

| Módulo | Entrega |
| --- | --- |
| **1. Branding** | Missão, visão, valores, manifesto, história, posicionamento, tom de voz, guia de identidade visual (paleta, tipografia, logotipo) |
| **2. Website** | Home, Sobre, Soluções, 8 verticais, Produtos, MVPs, Parceiros, Carreiras, Blog, Contato |
| **3. Design System** | 20+ componentes reutilizáveis (Botão, Card, Tabela, Modal, Gráficos, Calendário, FAQ, Carrossel…) com tema claro/escuro |
| **4. Produtos** | 18 produtos da família GW com página dedicada (objetivo, público, funcionalidades, fluxo, tecnologias) |
| **5. MVPs** | Login, dashboard, menu lateral, gráficos, tabelas, dados fictícios, responsividade, tema claro/escuro |
| **6–11. Verticais** | Governo Digital, Educação, Empresas, Banco Digital, Transporte, Meio Ambiente |
| **12. Enterprise** | Docker, Docker Compose, Kubernetes, PostgreSQL, MongoDB, Redis, RabbitMQ, Elasticsearch, NGINX, CI/CD, Prometheus/Grafana |
| **13. IA** | Assistente virtual, OCR, tradução automática, resumo, detecção de fraudes, predição, pesquisa semântica |
| **14. Documentação** | README, INSTALL, DEPLOY, API, CONTRIBUTING, CHANGELOG, Arquitetura, Manuais |

## 🚀 Começando em 3 passos

```bash
# 1. Instalar dependências
npm install

# 2. Executar em desenvolvimento
npm run dev

# 3. Abrir no navegador
http://localhost:3000
```

Acesse os MVPs em [http://localhost:3000/login](http://localhost:3000/login)
(`demo@gwdc.gw` / `demo1234`).

## 📚 Documentação

| Documento | Conteúdo |
| --- | --- |
| [INSTALL.md](docs/INSTALL.md) | Requisitos mínimos, instalação passo a passo |
| [DEPLOY.md](docs/DEPLOY.md) | Publicação em Vercel, Netlify e servidor Linux (Nginx) |
| [API.md](docs/API.md) | Contratos de API, autenticação e endpoints futuros |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura de software e fluxos de dados |
| [PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) | Estrutura completa de diretórios |
| [MANUAL-USUARIO.md](docs/MANUAL-USUARIO.md) | Manual do usuário (site + MVPs) |
| [MANUAL-ADMINISTRADOR.md](docs/MANUAL-ADMINISTRADOR.md) | Manual do administrador |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Como contribuir com o código |
| [CHANGELOG.md](docs/CHANGELOG.md) | Histórico de versões |

## 🧰 Stack tecnológica

- **Framework:** Next.js 15 (App Router) · React 19 · TypeScript estrito
- **Estilo:** Tailwind CSS 4 · Design System próprio (20+ componentes)
- **Dados/IA:** Recharts · utilitários de IA determinísticos (OCR, tradução, predição, antifraude)
- **Qualidade:** ESLint 9 · TypeScript estrito · Vitest (15 testes) · GitHub Actions CI
- **Infra:** Docker · Docker Compose · Kubernetes · NGINX · Prometheus · Grafana · PostgreSQL · MongoDB · Redis · RabbitMQ · Elasticsearch

## ✅ Checklist de qualidade

| Verificação | Comando |
| --- | --- |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Testes | `npm run test` |
| Build | `npm run build` |
| Acessibilidade | WCAG 2.2: foco visível, ARIA, `prefers-reduced-motion`, contraste AA |

## 🏛️ Governança

- **Licença:** uso exclusivo GW Digital Company (UNLICENSED)
- **Segurança:** headers de proteção no Next, segredos via `.env`, ingress TLS no Kubernetes
- **Dados fictícios:** todos os dashboards usam dados de demonstração realistas

© 2026 GW Digital Company · Bissau, Guiné-Bissau
