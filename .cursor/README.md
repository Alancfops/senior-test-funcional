# Configuração Cursor deste projeto

| Pasta | Conteúdo |
|-------|----------|
| `rules/` | Regras persistentes (LGPD, telas Figma obrigatórias, …) |
| `commands/` | `/session` → salvar conversa (frontmatter `name` + `description`) |
| `skills/save-session/` | Skill `save-session` — resumo em `session/` |
| `skills/wcag2-frontend-ui/` | Skill WCAG 2 — UI/UX acessível no app (nível AA) |
| `skills/figma-to-frontend/` | Skill Figma → implementação de telas (Expo/RN + docs/) |
| `skills/conventional-commits/` | Skill Git — Conventional Commits em inglês |
| `skills/git-branching/` | Skill Git — branches (`develop`, `feature/`, `hotfix/`, …) |
| `agents/` | Subagents — `senior-test-docs-maintainer`, `senior-test-frontend` |

## Não aparece `.cursor` no explorador?

A pasta **existe no disco** (não foi apagada). O que some é só a **visualização**.

### Causas mais comuns

1. **Explorador do Linux (Arquivos)** — pastas com `.` ficam ocultas até **`Ctrl + H`**.
2. **Config global do Cursor** — em *Files: Exclude* pode haver `**/.cursor` ou `.cursor` com exclusão ativa (remova com **X**).
3. **`false` no `settings.json` nem sempre vence** o exclude global; o certo é **remover** o padrão na UI, não só adicionar `false`.
4. **Bug da árvore “Glass”** (Cursor recente) — pasta vazia ao expandir: recolher/expandir de novo ou trocar para explorador clássico.

### Teste rápido no Cursor

- `Ctrl + P` → digite `.cursor/commands/session` → se abrir, a pasta está lá.
- Terminal: `ls -la .cursor`

### Settings deste repo

`.vscode/settings.json` tenta forçar exibição de `.cursor`. Se não bastar, ajuste em **User** (global): `Ctrl + ,` → *files exclude*.
