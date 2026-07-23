# Documentação — Sênior Teste Funcional

Índice canônico da **especificação** do produto. Conteúdo em **português**; pastas e arquivos em **inglês**.

O monorepo contém **`docs/`** (o quê/por quê), **`backend/`** (API) e **`frontend/`** (app). Instalação e Makefile: [README na raiz](../README.md).

**Status (jul/2026):** Fases **A–C** concluídas; **Fase D** (integração app ↔ API) em andamento. Roteiro: [engineering/repository-and-workflow.md](engineering/repository-and-workflow.md).

| Pasta em `docs/` | Conteúdo |
|------------------|----------|
| [product/](product/) | PRD, requisitos (RF), LGPD |
| [backend/](backend/) | Comportamento da API — contexto, stack, fluxos, dados, LGPD |
| [frontend/](frontend/) | Comportamento do app — telas, gráficos, PDF, LGPD |
| [engineering/](engineering/) | Arquitetura global, modelo de dados, fases A→E |
| [clinical-protocols/](clinical-protocols/) | Roteiros de aplicação (não substituem RF) |
| [contracts/](contracts/) | Snapshots OpenAPI (Swagger ao vivo em `/api/docs`) |

**Princípio:** `product/` = o que o software **obriga**; `clinical-protocols/` = como **aplicar** o teste; `backend/` e `frontend/` em `docs/` = **comportamento** de cada camada; código em `backend/` e `frontend/` na raiz.

---

## Leitura rápida

| Objetivo | Documento |
|----------|-----------|
| Visão de produto | [product/PRD.md](product/PRD.md) |
| RF001–RF013 | [product/requirements.md](product/requirements.md) |
| LGPD | [product/privacy-and-lgpd.md](product/privacy-and-lgpd.md) |
| Arquitetura global e stack | [engineering/architecture.md](engineering/architecture.md) |
| **Backend (API)** | [backend/README.md](backend/README.md) |
| **Frontend (app)** | [frontend/README.md](frontend/README.md) |
| Mapa Figma ↔ rotas ↔ RFs | [frontend/figma-map.md](frontend/figma-map.md) |
| Modelo de dados | [engineering/data-model.md](engineering/data-model.md) |
| Fases A→E | [engineering/repository-and-workflow.md](engineering/repository-and-workflow.md) |
| Decisões explícitas (TCC, e-mail, escopo) | [engineering/project-decisions.md](engineering/project-decisions.md) |
| Protocolos clínicos | [clinical-protocols/README.md](clinical-protocols/README.md) |
| Contratos (OpenAPI) | [contracts/README.md](contracts/README.md) — snapshots quando existirem |
| Roteiro MEEM (exemplo) | [clinical-protocols/instruments/meem/assess.md](clinical-protocols/instruments/meem/assess.md) |

---

## Manutenção

1. Comportamento oficial → **`product/`** primeiro.  
2. Papel da API ou do app → **`backend/`** ou **`frontend/`**.  
3. Decisões técnicas transversais → **`engineering/`**.  
4. Texto clínico → **`clinical-protocols/`**.

Legado Word: `docs/_legacy/` — use `product/requirements.md`.
