# Sênior Teste Funcional — Guia para agentes

Contexto técnico e de produto estão em **`docs/`**. A **implementação** vive em **`backend/`** (API NestJS) e **`frontend/`** (app Expo).

## Por onde começar

1. **[README.md](README.md)** — instalação local (`make setup`, `make start`)
2. **[docs/README.md](docs/README.md)** — índice da especificação
3. **[docs/engineering/architecture.md](docs/engineering/architecture.md)** — stack e módulos
4. **[session/](session/)** — resumos das conversas anteriores (leia os `.md` mais recentes **antes** de agir)

| Camada | Documentação |
|--------|----------------|
| API | [docs/backend/README.md](docs/backend/README.md) |
| App | [docs/frontend/README.md](docs/frontend/README.md) |
| LGPD | [docs/product/privacy-and-lgpd.md](docs/product/privacy-and-lgpd.md) |
| Fluxo Git / fases | [docs/engineering/repository-and-workflow.md](docs/engineering/repository-and-workflow.md) |

Pastas em `docs/` com nomes em **inglês**; texto em **português**.

## Status do projeto (ago/2026)

| Fase | Estado |
|------|--------|
| A — Telas Figma no app | Concluída |
| B–C — API RF001–RF013 | Concluída |
| D — Integração app ↔ API | Em andamento (`EXPO_PUBLIC_MOCK_AUTH=false`) |
| Admin web / papel `ADMIN` | Em desenvolvimento (`backend/src/admin/`) |

Detalhe das fases: [docs/engineering/repository-and-workflow.md](docs/engineering/repository-and-workflow.md).

## Estrutura do repositório

```
senior-test-funcional/
├── AGENTS.md              ← este arquivo (entrada global)
├── backend/               ← NestJS + Prisma + PostgreSQL
│   └── AGENTS.md          ← guia específico da API
├── frontend/              ← Expo SDK 54 + React Native
│   └── AGENTS.md          ← guia específico do app
├── docs/                  ← especificação (fonte de produto)
├── session/               ← histórico local de conversas (não versionado)
└── .cursor/               ← rules, skills, commands, agents
```

## Comportamento esperado do agente

1. **Leia** `session/` e a documentação relevante em `docs/` antes de implementar.
2. **Respeite** as rules em `.cursor/rules/` (LGPD, Figma, backend authority).
3. **Use** skills quando aplicável (Figma → frontend, scoring → instrumentos, WCAG → UI).
4. **Não invente** telas fora do Figma — avise o usuário se o frame não existir.
5. **Não commite** salvo pedido explícito; **não inclua** segredos (`.env`, tokens).
6. **Dados pessoais/sensíveis** → revisão LGPD obrigatória antes de concluir (rule `lgpd-sensitive-data-review`).

## Comandos Cursor

| Comando | O que faz |
|---------|-----------|
| **`/session`** | Salva resumo da conversa em `session/` (skill `save-session`) |
| **`/code-review`** | Revisão de código — Bugbot + Security + checklist projeto |
| **`/verify-instruments`** | Valida scoring e payloads TUG/Katz/Berg/Tinetti/MEEM |

Definições: [.cursor/commands/](.cursor/commands/) · índice Cursor: [.cursor/README.md](.cursor/README.md)

> No explorador de arquivos do Linux, pastas com `.` ficam ocultas até **`Ctrl + H`**.

## Rules, skills e subagents

| Tipo | Item | Quando |
|------|------|--------|
| Rule | [lgpd-sensitive-data-review](.cursor/rules/lgpd-sensitive-data-review.mdc) | Alterações com dados pessoais/sensíveis |
| Rule | [figma-screens-required](.cursor/rules/figma-screens-required.mdc) | UI só conforme Figma; tela ausente → avisar usuário |
| Rule | [backend-server-authority](.cursor/rules/backend-server-authority.mdc) | API = fonte da verdade; scoring no finalize; isolamento `therapist_id` |
| Rule | [backend-nestjs-implementation](.cursor/rules/backend-nestjs-implementation.mdc) | Padrões NestJS/Prisma ao editar `backend/` |
| Skill | [save-session](.cursor/skills/save-session/SKILL.md) | `/session` — registrar conversa em `session/` |
| Skill | [wcag2-frontend-ui](.cursor/skills/wcag2-frontend-ui/SKILL.md) | UI/UX do app — WCAG 2 nível AA |
| Skill | [figma-to-frontend](.cursor/skills/figma-to-frontend/SKILL.md) | Telas do [Figma Senior Teste Funcional](https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional?node-id=1-11490) |
| Skill | [conventional-commits](.cursor/skills/conventional-commits/SKILL.md) | Commits em inglês — `type(scope): subject` |
| Skill | [git-branching](.cursor/skills/git-branching/SKILL.md) | Branches — `develop`, `feature/`, `hotfix/`, `docs/` |
| Skill | [code-review](.cursor/skills/code-review/SKILL.md) | Revisão — Bugbot + Security + checklist LGPD/API |
| Skill | [clinical-instrument-scoring](.cursor/skills/clinical-instrument-scoring/SKILL.md) | Verificar questionários (TUG, Katz, Berg, Tinetti, MEEM) |
| Agent | [senior-test-docs-maintainer](.cursor/agents/senior-test-docs-maintainer.md) | Manutenção de documentação em `docs/` |
| Agent | [senior-test-backend](.cursor/agents/senior-test-backend.md) | API NestJS — Prisma, scoring, OpenAPI, linkagem com front |
| Agent | [senior-test-frontend](.cursor/agents/senior-test-frontend.md) | UI/UX mobile — Figma, WCAG 2 AA, Expo/RN, integração API |

## Invariantes de negócio (resumo)

- **Autorização:** todo acesso a paciente/avaliação/PDF filtra por `therapist_id` do JWT.
- **Scoring:** `AssessmentResult` só após `POST .../finalize` válido — cálculo **no servidor**.
- **PDF e e-mail:** gerados/enviados **só** pela API.
- **MEEM:** corte Brucki usa `schooling_band_used` da **sessão**, não do cadastro do paciente.
