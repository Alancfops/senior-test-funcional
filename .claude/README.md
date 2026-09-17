# Configuração Claude Code deste projeto

Entrada global do repositório: [`../CLAUDE.md`](../CLAUDE.md). Guias por camada: [`../backend/CLAUDE.md`](../backend/CLAUDE.md) e [`../frontend/CLAUDE.md`](../frontend/CLAUDE.md).

O Claude Code não tem conceito nativo de "rules" — as regras do projeto ficam em [`../docs/rules/`](../docs/rules/) e são carregadas via `@import` no `CLAUDE.md`.

| Pasta | Conteúdo |
|-------|----------|
| `commands/` | `/session`, `/stf-code-review`, `/verify-instruments` |
| `agents/` | Subagentes — `senior-test-docs-maintainer`, `senior-test-backend`, `senior-test-frontend` |
| `skills/save-session/` | Skill `save-session` — resumo da conversa em `session/` |
| `skills/wcag2-frontend-ui/` | Skill WCAG 2 — UI/UX acessível no app (nível AA) |
| `skills/figma-to-frontend/` | Skill Figma → implementação de telas (Expo/RN + docs/) |
| `skills/conventional-commits/` | Skill Git — Conventional Commits em inglês |
| `skills/git-branching/` | Skill Git — branches (`develop`, `feature/`, `hotfix/`, …) |
| `skills/stf-code-review/` | Skill de revisão — invoca `/code-review` + `/security-review` + checklist do projeto |
| `skills/clinical-instrument-scoring/` | Skill de verificação TUG/Katz/Berg/Tinetti/MEEM |

## Regras (`../docs/rules/`)

| Arquivo | Aplicação |
|---------|-----------|
| `backend-server-authority.md` | Sempre — servidor é fonte da verdade |
| `figma-screens-required.md` | Sempre — UI só conforme Figma |
| `lgpd-sensitive-data-review.md` | Sempre — revisão LGPD em dados pessoais/sensíveis |
| `backend-nestjs-implementation.md` | Ao editar `backend/**` ou `packages/**` (ver `backend/CLAUDE.md`) |

As três primeiras são importadas com `@` no `CLAUDE.md`, então carregam em toda sessão.

## Como salvar uma sessão

`/session` no chat (ou peça "salva essa sessão") → skill `save-session` grava um resumo em `session/YYYY-MM-DD_HH-MM.md` e atualiza `session/README.md`. A pasta `session/` é local (`.gitignore`); só o `README.md` é versionado.

## A pasta `.claude` não aparece no explorador de arquivos?

No explorador do Linux (Arquivos/Nautilus) pastas com `.` ficam ocultas até **`Ctrl + H`**. No editor, ajuste *Files: Exclude* nas configurações se algum padrão `**/.claude` estiver ativo. A pasta continua no disco — confirme com `ls -la .claude`.
