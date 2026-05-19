# Backend — Sênior Teste Funcional

**Prioridade de implementação** neste projeto. O cliente mobile consome apenas a API documentada aqui.

## Objetivos imediatos

1. Expor endpoints REST estáveis cobrindo [levantamento-requisitos.md](../docs/produto/levantamento-requisitos.md) (RF001+) em incremental.
2. Publicar/manter contrato **[OpenAPI 3]** (Swagger no Nest ou `openapi.yaml`) para o frontend rascunho e para a futura implementação guiada pelo design.

## Como documentar dentro desta pasta (quando o código existir)

Estrutura sugerida (ajuste ao framework):

```
backend/
├── README.md                     # Você está aqui
├── src/                          # Código NestJS ou equivalente (a criar)
├── prisma/                       # prisma.schema + migrações (a criar)
└── openapi/ ou gerado Swagger   # copiar ou artefatos CI (a criar)
```

## Modelo conceitual

Ver **[docs/engenharia/modelo-de-dados.md](../docs/engenharia/modelo-de-dados.md)**.

## Fluxo de trabalho

Ver **[docs/engenharia/repositorio-e-fluxo-desenvolvimento.md](../docs/engenharia/repositorio-e-fluxo-desenvolvimento.md)** — fases A e B concentram o esforço desta pasta primeiro.

### Quando o código existir (Bun workspaces)

Da **raiz** do repo: `bun install`. Para subir só a API, use o script configurado no `package.json` (exemplo típico: `bun run --filter backend start:dev`). Prisma CLI: prefira `bunx prisma`; se algo falhar, `npx prisma` como último recurso naquele comando.
