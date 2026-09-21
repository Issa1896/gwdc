# INSTALL — Instalação

Guia passo a passo para executar a plataforma GWDC em ambiente de desenvolvimento.

## Requisitos mínimos

| Ferramenta | Versão mínima | Motivo |
| --- | --- | --- |
| Node.js | 20 LTS (recomendado 22) | Runtime da plataforma |
| npm | 10 | Gerenciador de pacotes |
| Git | 2.40 | Controle de versão |
| Docker (opcional) | 24 + Compose v2 | Infraestrutura enterprise (Módulo 12) |
| Memória RAM | 4 GB | Compilação e dev server |

> ⚠️ O Node 22+ já inclui ICU completo; em versões antigas, datas em português podem formatar diferente.

## Passo 1 — Clonar e instalar

```bash
git clone <repo-url> gwdc
cd gwdc
npm install
# ou: pnpm install / yarn install
```

## Passo 2 — Variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite apenas o que precisar. Para o ambiente de desenvolvimento, os padrões funcionam.

## Passo 3 — Executar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Passo 4 — Credenciais de demonstração

| Área | Credencial |
| --- | --- |
| MVPs (todos os produtos) | `demo@gwdc.gw` / `demo1234` |

Qualquer e-mail válido + senha de 6+ caracteres cria uma sessão local.

## Passo 5 — Verificações

```bash
npm run lint      # análise estática
npm run typecheck # tipos TypeScript
npm test          # testes unitários (Vitest)
npm run build     # build de produção
npm start         # serve a build em http://localhost:3000
```

## Comandos úteis

```bash
npm run lint:fix    # corrige problemas de lint automaticamente
npm run preview     # serve a build de produção (porta 3000)
npx next info       # diagnóstico do ambiente
```

## Solução de problemas

| Problema | Solução |
| --- | --- |
| `EADDRINUSE :3000` | Outro processo usa a porta: `npm run dev -- -p 3001` |
| Erros de tipo após `git pull` | `rm -rf .next node_modules && npm install` |
| Fontes não carregam offline | next/font baixa no primeiro build; em ambientes sem internet, substituir por fonte local em `src/app/layout.tsx` |
| Build lento no Windows | Desativar antivírus para `node_modules`/`.next` ou usar WSL2 |
