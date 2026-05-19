# Backend — Sênior Teste Funcional

**Prioridade de implementação** neste projeto. O aplicativo cliente consome apenas a API documentada e versionada segundo as convenções do repositório.

## Objetivos imediatos

1. Expor endpoints REST estáveis incrementalmente segundo [levantamento-requisitos.md](../docs/produto/levantamento-requisitos.md) (RF001 em diante).  
2. Publicar e manter contrato **OpenAPI 3** coerente com o código-fonte (`openapi.yaml`/Swagger Nest ou ferramentas equivalentes) para garantir interoperabilidade com o cliente móvel e integrações eventualmente autorizadas.

Governança de dados sensíveis: [privacidade-e-lgpd.md](../docs/produto/privacidade-e-lgpd.md).

## Estrutura sugerida (ao criar o código)

```
backend/
├── README.md                     # Você está aqui
├── src/
├── prisma/                       # quando ORM migrações adotarem Prisma ou equivalentes
└── artefatos OpenAPI opcionais
```

Ver **[docs/engenharia/modelo-de-dados.md](../docs/engenharia/modelo-de-dados.md)** para modelo conceitual.

## Fluxo de trabalho e fases

**[docs/engenharia/repositorio-e-fluxo-desenvolvimento.md](../docs/engenharia/repositorio-e-fluxo-desenvolvimento.md)** — fases **A** e **B** concentram o esforço desta pasta no início do cronograma.

### Toolchain Bun (workspaces na raiz)

Na raiz: `bun install`. Subir apenas a API: script correspondente declarado futuramente (exemplo típico `bun run --filter backend start:dev`). Prisma CLI quando existir schema: prefira `bunx prisma`; use `npx prisma` apenas se binário pontual assim exigir.
