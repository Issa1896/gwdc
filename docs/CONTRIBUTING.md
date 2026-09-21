# CONTRIBUTING — Como contribuir

Obrigado por contribuir com a plataforma GWDC!

## Fluxo de trabalho

1. **Crie uma branch** a partir de `main`:
   ```bash
   git checkout main && git pull
   git checkout -b feat/nome-descritivo   # ou fix/, docs/, chore/
   ```
2. **Desenvolva** seguindo as convenções abaixo.
3. **Valide localmente** (obrigatório antes do push):
   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```
4. **Abra um Pull Request** para `main` com descrição clara (o que, por quê, como testar).
5. O CI executa lint, typecheck, testes e build automaticamente. **PR só é aprovado com CI verde.**

## Convenções de código

| Regra | Detalhe |
| --- | --- |
| Idioma | Português (pt-PT) em textos de UI; inglês em código e commits |
| TypeScript | Estrito; sem `any`; tipos exportados em `src/lib/types.ts` |
| Componentes | Function components + hooks; props tipadas com `interface` |
| Estilo | Tailwind utilitário; tokens de `globals.css` (não cores hardcoded) |
| Dados | Novos produtos/verticals → `src/data/*.ts` (fonte única, tipada) |
| Comentários | Apenas quando explicam o "porquê" (regra do projeto: sem comentários óbvios) |
| Acessibilidade | `aria-*`, foco visível, contraste AA, `prefers-reduced-motion` |

## Padrão de commits

```
feat: adiciona página de transparência
fix: corrige formato de datas em pt-PT
docs: atualiza DEPLOY.md
test: cobre predição de séries na IA
chore: atualiza dependências
```

## Testes

- Framework: **Vitest** (`npm test`)
- Localização: `tests/*.test.ts`
- Teste novo funcionalidade → **cubra com teste unitário** (IA, utilitários, dados)
- Rode `npm test` antes de abrir o PR

## Estrutura de pastas

Consulte `docs/PROJECT-STRUCTURE.md` para a árvore completa e `docs/ARCHITECTURE.md`
para entender os fluxos antes de tocar em `src/data`, `src/lib` ou `src/components/dashboard`.

## Dúvidas

Abra uma issue com o rótulo adequado (bug, enhancement, question). Respostas em
português ou inglês são bem-vindas.
