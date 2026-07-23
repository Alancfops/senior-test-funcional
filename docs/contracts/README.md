# Contratos de interface (machine-readable)

Pasta para **artefatos consumíveis automaticamente**: tipos de cliente, checagens de conformidade em CI ou referência offline.

## Situação atual

| Fonte | Onde | Uso |
|-------|------|-----|
| **Swagger (ao vivo)** | `http://localhost:3000/api/docs` com API em execução | Referência principal na Fase D |
| **Snapshots versionados** | `docs/contracts/openapi/` (quando publicados) | Diff revisível antes de rupturas semver |

A API NestJS já expõe OpenAPI via `@nestjs/swagger` em `/api/docs`. Snapshots em disco são **opcionais** — úteis para CI sem subir o servidor.

## Estrutura sugerida (futuro)

```
docs/contracts/
├── openapi/
│   └── openapi-v1.yaml    # export periódico do Swagger
└── schemas/               # exemplos JSON opcionais para QA
```

**Propagação:** artefatos dinâmicos vêm do `backend/`; esta pasta acumula apenas **snapshots** quando a equipe quiser versioná-los explicitamente.

Instalação e execução local: [README na raiz](../../README.md).
