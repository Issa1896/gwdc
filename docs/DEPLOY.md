# DEPLOY — Publicação em produção

A plataforma GWDC pode ser publicada em **Vercel**, **Netlify**, **servidor Linux com Nginx** ou
**Kubernetes**. Escolha o caminho adequado ao seu projeto.

---

## Opção A — Vercel (recomendada para início rápido)

1. Instale a CLI: `npm i -g vercel`
2. Na raiz do projeto: `vercel` (dev) e `vercel --prod` (produção)
3. Ou importe o repositório no painel **vercel.com/new** (framework detectada: Next.js)
4. Variáveis de ambiente → adicione `NEXT_PUBLIC_SITE_URL`
5. Deploy automático: cada `push` para `main` publica (Vercel substitui o CI do Módulo 12)

## Opção B — Netlify

1. **netlify.com/new** → importe o repositório
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Node version: 22 (Settings → Environment)
5. Ative o plugin **Netlify Next.js Runtime** (adiciona `public/netlify.toml`)

> ⚠️ No Netlify, remova o `output: "standalone"` de `next.config.ts` (incompatível com o runtime).

## Opção C — Servidor Linux (Docker Compose)

```bash
# 1. Copie os arquivos para o servidor (Ubuntu 22.04+, Docker instalado)
scp -r . user@servidor:/opt/gwdc

# 2. Configure as variáveis
cd /opt/gwdc && cp .env.example .env && nano .env

# 3. Suba a stack completa (web + gateway + bancos + observabilidade)
docker compose up -d --build

# 4. Verifique
docker compose ps          # todos os serviços "Up"
curl http://localhost/healthz
```

| Porta | Serviço | Painel |
| --- | --- | --- |
| 80/443 | NGINX (gateway) | — |
| 3001 | Grafana | `admin` / senha em `GRAFANA_PASSWORD` |
| 5601 | Kibana | — |
| 9090 | Prometheus | — |
| 15672 | RabbitMQ | `guest` / `guest` |

**Produção real:** configure um certificado TLS (Let's Encrypt via `certbot`) e aponte os
`server_name` em `nginx/nginx.conf` para o seu domínio.

## Opção D — Kubernetes

```bash
# Pré-requisitos: cluster (kind/minikube/EKS/GKE), kubectl, ingress-nginx, cert-manager
kubectl apply -k k8s/          # cria namespace, deployment (3 réplicas), service, HPA, ingress

# Verificar
kubectl -n gwdc get pods,svc,ing
kubectl -n gwdc rollout status deploy/gwdc-web

# Imagem própria (use sua registry)
docker build -t sua-registry/gwdc:tag .
docker push sua-registry/gwdc:tag
# e atualize `image:` em k8s/app.yaml
```

Recursos incluídos: Deployment (3 réplicas), HPA (3–12), PDB (mín. 2), readiness/liveness probes,
Ingress TLS, ConfigMap, Secret (SOPS/SealedSecrets em produção).

## CI/CD (GitHub Actions)

`.github/workflows/ci.yml` roda **lint → typecheck → testes → build** a cada push/PR e publica a
imagem Docker em `ghcr.io` quando o commit entra em `main`.

Segredos necessários no repositório:
- `NEXT_PUBLIC_SITE_URL` — URL pública
- `DEPLOY_WEBHOOK_URL` — webhook opcional de notificação

## Estratégia de lançamento (Go-Live)

1. **Fase piloto:** apenas verticais Governo Digital + Educação, com dados controlados
2. **Validação:** reuniões quinzenais com stakeholders e testes de aceitação
3. **Expansão:** demais verticais em ondas (Empresas → Finanças → Saúde/Justiça)
4. **Continuidade:** monitoramento (Grafana), backups noturnos, revisão mensal de métricas

## Backup e recuperação

```bash
# PostgreSQL
docker compose exec postgres pg_dump -U gwdc gwdc > backup-$(date +%F).sql

# Restauração
cat backup.sql | docker compose exec -T postgres psql -U gwdc gwdc

# Volumes completos
docker run --rm -v gwdc_pgdata:/data -v $(pwd):/backup alpine tar czf /backup/pgdata.tar.gz /data
```

Programe backups noturnos via `cron` e teste a restauração trimestralmente.
