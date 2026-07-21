# Documentação — Sênior Teste Funcional

Índice canônico. Conteúdo em **português**; pastas e arquivos em **inglês**.

Este repositório é **documentação do produto e da arquitetura** — a implementação vive em `backend/` e `frontend/` (monorepo previsto; ver [engineering/repository-and-workflow.md](engineering/repository-and-workflow.md)).

**Status da arquitetura (2026):** **Fase A em andamento** — frontend (telas Figma + mocks no Expo); backend (Fases B–C) e integração (Fase D) conforme [repository-and-workflow.md](engineering/repository-and-workflow.md).

Visão resumida: [README na raiz](../README.md).

| Pasta em `docs/` | Conteúdo |
|------------------|----------|
| [product/](product/) | PRD, requisitos (RF), LGPD |
| [backend/](backend/) | Arquitetura da API: contexto, stack, porquês, fluxos, dados, LGPD (sem código) |
| [frontend/](frontend/) | Arquitetura do app: contexto, stack, telas, gráficos, PDF, LGPD (sem código) |
| [engineering/](engineering/) | Arquitetura global, modelo de dados, fluxo A→E |
| [clinical-protocols/](clinical-protocols/) | Roteiros de aplicação (não substituem RF) |
| [contracts/](contracts/) | OpenAPI / schemas (quando existirem) |

**Princípio:** `product/` = o que o software **obriga**; `clinical-protocols/` = como **aplicar** o teste; `backend/` e `frontend/` = **papel e comportamento** de cada camada, sem código.

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
