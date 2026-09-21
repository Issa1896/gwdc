# MANUAL DO ADMINISTRADOR — Plataforma GWDC

Guia de operação, manutenção e suporte da plataforma.

---

## 1. Ambientes

| Ambiente | URL | Uso |
| --- | --- | --- |
| Desenvolvimento | `http://localhost:3000` | `npm run dev` |
| Staging (Vercel preview) | URL de cada PR | Validação de mudanças |
| Produção | domínio oficial | Usuários finais |

Toda mudança passa por: **dev → PR (staging) → main (produção)** — garantido pelo
workflow do Módulo 12 (lint, typecheck, testes e build antes do deploy).

## 2. Operações diárias

### Verificação de saúde
```bash
npm run lint && npm run typecheck && npm test && npm run build
```

### Verificação da stack (Docker)
```bash
docker compose ps                  # todos os serviços devem estar "Up"
docker compose logs -f web         # logs da aplicação
curl http://localhost/healthz      # 200 = saudável
```

### Backup (noturno, via cron)
```bash
# PostgreSQL
0 2 * * * docker compose exec -T postgres pg_dump -U gwdc gwdc | gzip > /backups/gwdc-$(date +\%F).sql.gz

# Volumes
0 3 * * * docker run --rm -v gwdc_pgdata:/data -v /backups:/out alpine tar czf /out/pgdata.tar.gz -C /data .
```

Retenção: 30 dias. **Teste a restauração trimestralmente.**

## 3. Monitoramento

| Painel | URL | Credenciais padrão |
| --- | --- | --- |
| Grafana | `http://servidor:3001` | `admin` / `GRAFANA_PASSWORD` |
| Kibana | `http://servidor:5601` | — (segurança desabilitada na demo) |
| Prometheus | `http://servidor:9090` | — |
| RabbitMQ | `http://servidor:15672` | `guest` / `guest` |

**Alertas recomendados no Grafana:** CPU > 80% (5 min), memória > 85%, resposta > 2s,
5xx > 1% (10 min), disco > 85%.

## 4. Publicação de nova versão

```bash
# Local
git checkout main && git pull
npm ci && npm run lint && npm run typecheck && npm test && npm run build

# Docker
docker compose up -d --build web gateway

# Kubernetes
docker build -t ghcr.io/gwdc/gw-digital-platform:novo-tag .
docker push ghcr.io/gwdc/gw-digital-platform:novo-tag
kubectl set image deploy/gwdc-web web=ghcr.io/gwdc/gw-digital-platform:novo-tag -n gwdc
kubectl -n gwdc rollout status deploy/gwdc-web
```

Rollback: `kubectl rollout undo deploy/gwdc-web -n gwdc` (ou `docker compose up -d web:tag-anterior`).

## 5. Gestão de acessos

- **Desenvolvedores:** GitHub (branch `main` protegida, PR obrigatório + CI verde)
- **Administradores do dashboard:** sessões simuladas por enquanto; em produção, OIDC
  corporativo (`OIDC_ISSUER_URL`/`OIDC_CLIENT_ID`/`OIDC_CLIENT_SECRET` no `.env`)
- **Segredos:** nunca em código; usar `sops`/`sealed-secrets` no cluster, variáveis de
  ambiente nos PaaS

## 6. Incidentes

1. **Deteção** → alerta Grafana/monitoramento
2. **Classificação** → Sev-1 (fora do ar), Sev-2 (degradação), Sev-3 (cosmético)
3. **Resposta** → rollback imediato para a última versão estável
4. **Registro** → documento de post-mortem no repositório (`docs/incidents/`)
5. **Prevenção** → item no backlog com responsável e prazo

## 7. Manutenção programada

- **Windows de manutenção:** domingo, 02h–04h (GMT), se necessário
- **Atualizações de dependências:** mensais, via PR dedicada (`npm audit` limpo)
- **Certificados TLS:** renovação automática (cert-manager / certbot) + aviso 14 dias antes
- **Expansão de conteúdo:** novos produtos → `src/data/products.ts` + página; novo blog →
  `src/data/content.ts`
