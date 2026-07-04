Contexto técnico e de produto estão em **`docs/`** (repositório de **documentação**, sem código de API/app).

Comece por **[docs/README.md](docs/README.md)** e **[docs/engineering/architecture.md](docs/engineering/architecture.md)**.

| Camada | Documentação |
|--------|----------------|
| API | [docs/backend/README.md](docs/backend/README.md) |
| App | [docs/frontend/README.md](docs/frontend/README.md) |
| LGPD | [docs/product/privacy-and-lgpd.md](docs/product/privacy-and-lgpd.md) |

Pastas em `docs/` com nomes em **inglês**; texto em **português**.

**Histórico de conversas:** antes de trabalhar, leia os `.md` mais recentes em **[session/](session/)**. Para salvar: **`/session`** (`.cursor/commands/session.md`). No Arquivos do Linux, pastas com `.` podem ficar ocultas até **`Ctrl + H`**.

**Cursor (`.cursor/`):** índice em **[.cursor/README.md](.cursor/README.md)**.

| Tipo | Item | Quando |
|------|------|--------|
| Rule | [lgpd-sensitive-data-review](.cursor/rules/lgpd-sensitive-data-review.mdc) | Alterações com dados pessoais/sensíveis — revisão LGPD obrigatória |
| Rule | [figma-screens-required](.cursor/rules/figma-screens-required.mdc) | UI só conforme Figma; tela ausente → avisar usuário, não inventar |
| Skill | [save-session](.cursor/skills/save-session/SKILL.md) | `/session` — registrar conversa em `session/` |
| Skill | [wcag2-frontend-ui](.cursor/skills/wcag2-frontend-ui/SKILL.md) | UI/UX do app — WCAG 2 nível AA |
| Skill | [figma-to-frontend](.cursor/skills/figma-to-frontend/SKILL.md) | Implementar telas do [Figma](https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional) com base em `docs/` |
| Skill | [conventional-commits](.cursor/skills/conventional-commits/SKILL.md) | Commits em inglês — `type(scope): subject` (sem assinatura de IA) |
| Skill | [git-branching](.cursor/skills/git-branching/SKILL.md) | Branches — `develop`, `feature/`, `hotfix/`, `docs/`, merge seguro |
| Agent | [senior-test-docs-maintainer](.cursor/agents/senior-test-docs-maintainer.md) | Manutenção de documentação em `docs/` |
| Agent | [senior-test-frontend](.cursor/agents/senior-test-frontend.md) | UI/UX mobile — Figma, WCAG 2 AA, Expo/RN, integração API |
