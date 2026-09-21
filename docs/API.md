# API — Contratos e referência

A plataforma é atualmente **server-side rendered (SSG)** com dados embutidos.
Esta documentação define os contratos que a **API GWDC (v1)** exporá quando os serviços
do Módulo 12 (PostgreSQL, Redis, mensageria) forem ativados.

---

## 1. Autenticação

A sessão de demonstração é **simulada no navegador** (localStorage) — `src/lib/mvp/auth.ts`.

| Campo | Valor |
| --- | --- |
| Usuário de demonstração | `demo@gwdc.gw` |
| Senha | `demo1234` |
| Regra de produção | Validação no servidor; tokens JWT assinados; refresh rotativo |

**Fluxo (produção):**

```
POST /api/v1/auth/login
Body: { "email": "demo@gwdc.gw", "password": "demo1234" }

201 Created
{ "accessToken": "jwt…", "expiresIn": 3600, "user": { "id": "u_01", "name": "Administrador", "role": "admin" } }
```

```
POST /api/v1/auth/logout      → 204
GET  /api/v1/auth/me          → 200 (perfil + permissões)
```

## 2. Erros padronizados

| Código | Significado |
| --- | --- |
| `400` | Requisição inválida (validação de schema) |
| `401` | Não autenticado / token expirado |
| `403` | Sem permissão para o recurso |
| `404` | Recurso não encontrado |
| `409` | Conflito (registro duplicado) |
| `422` | Dados semânticamente inválidos |
| `429` | Limite de taxa excedido (rate limit) |
| `500` | Erro interno |

Formato de erro:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "O campo email é obrigatório",
    "fields": { "email": "Formato inválido" },
    "requestId": "req_9f3a"
  }
}
```

## 3. Produtos

```
GET /api/v1/products                     → lista (paginada, 18 itens)
GET /api/v1/products/{slug}              → detalhe (objetivo, funcionalidades, fluxo, métricas)
GET /api/v1/products?category=educacao   → filtro por vertical
```

**Schema (resumo):**

```json
{
  "slug": "gw-school",
  "name": "GW-School",
  "category": "educacao",
  "status": "piloto",
  "kpis": [
    { "label": "Alunos", "value": "31.850", "delta": "+4,2%" }
  ]
}
```

## 4. MVPs — dados de dashboard (fonte: `src/data/mvp/*.ts`)

```
GET /api/v1/mvp/{product}/overview        → KPIs + alertas
GET /api/v1/mvp/{product}/charts          → séries temporais
GET /api/v1/mvp/{product}/table           → tabela principal
GET /api/v1/mvp/{product}/sections        → seções especiais (calendário, QR, rastreio…)
```

**Exemplo — `/api/v1/mvp/gw-bank/overview`:**

```json
{
  "kpis": [
    { "label": "Contas ativas", "value": "12.480", "delta": "+8,4%", "trend": "up" }
  ],
  "alerts": [
    { "level": "warning", "title": "Fila de PIX 5 min acima do limite" }
  ]
}
```

## 5. IA (Módulo 13)

| Endpoint | Função |
| --- | --- |
| `POST /api/v1/ai/ocr` | Extração de texto de documentos (ID, bilhetes, diplomas) |
| `POST /api/v1/ai/translate` | Tradução crioulo ↔ português ↔ inglês |
| `POST /api/v1/ai/summarize` | Resumo de relatórios e processos |
| `POST /api/v1/ai/fraud-check` | Score de fraude (0–100) para transações |
| `POST /api/v1/ai/forecast` | Predição de séries (demanda, receita, leitos) |
| `GET  /api/v1/ai/recommend/{userId}` | Recomendações personalizadas |
| `POST /api/v1/ai/search` | Pesquisa semântica no acervo |

**Exemplo — fraud-check:**

```json
POST /api/v1/ai/fraud-check
{ "amount": 150000, "origin": "Bissau", "dest": "Maputo", "hour": 23, "deviceId": "d_77" }

200 OK
{ "score": 87, "flags": ["valor_atipico", "horario_atipico"], "recommendation": "block" }
```

## 6. Infraestrutura

| Endpoint | Uso |
| --- | --- |
| `GET /healthz` | Liveness/readiness (k8s, docker healthcheck) |
| `GET /api/metrics` | Métricas Prometheus (job `gwdc-web`) |
| `GET /api/v1/info` | Versão, commit, uptime |

## 7. Rate limit e versionamento

- Versionamento por **prefixo** (`/api/v1`) — sem breaking changes no v1.
- Rate limit: 30 req/s por IP no gateway (NGINX) e 100 req/min nos endpoints de IA.
- Paginação: `?page=1&pageSize=25` + headers `X-Total-Count`.
- Idempotência: header `Idempotency-Key` em POSTs de escrita.
