# Histórico de sessões (conversas com agente)

Esta pasta guarda **resumos em Markdown** do que foi discutido e feito em cada sessão de trabalho com o Cursor.

**Git:** arquivos `session/*.md` ficam **locais** (`.gitignore`); só este `README.md` é versionado como índice/convenção.

**Como salvar:** **`/session`** no chat ou peça *“salva essa sessão”* (skill `save-session`). Se `/session` não listar, use o pedido em texto.

## Convenção de nomes

```
YYYY-MM-DD_HH-MM.md
```

Exemplo: `2026-06-03_15-42.md`

## Como usar

| Quem | Ação |
|------|------|
| Você | Peça para salvar a sessão (`/save-session`, "guarda essa sessão", etc.) |
| Agente | Ao iniciar tarefas, leia os arquivos mais recentes aqui antes de agir |
| Agente (principal, **senior-test-backend**, **senior-test-frontend**) | Ao pedido **`/session`**, execute skill **`save-session`** e atualize esta tabela |

## Índice recente

| Data | Arquivo | Resumo |
|------|---------|--------|
| 2026-07-16 16:23 | [2026-07-16_16-23.md](2026-07-16_16-23.md) | TUG+cronômetro; Lista Pacientes+Config Figma; Informações do Sistema (Erika, Alan Cristian); **sem commit** |
| 2026-07-16 15:39 | [2026-07-16_15-39.md](2026-07-16_15-39.md) | Mock auth alan@email.com; fluxo avaliação Berg/Katz/Tinetti/MEEM (apply→tutorial→coleta→resultado); commit+push `22bf6c1` develop |
| 2026-07-08 19:05 | [2026-07-08_19-05.md](2026-07-08_19-05.md) | Home + cadastro paciente + perfil RF006 (mock); docs fases frontend-first; logo/gradiente; backend agent + `/session` |
| 2026-07-04 18:25 | [2026-07-04_18-25.md](2026-07-04_18-25.md) | Auth Figma refinado (SDK 54, logo, tokens, cadastro plain); commit+merge em `develop`; local em `develop` |
| 2026-07-04 15:58 | [2026-07-04_15-58.md](2026-07-04_15-58.md) | Arquitetura commitada/push; skills review+instrumentos; agent backend; app Expo login/cadastro Figma; fix npm/assets |
| 2026-06-11 13:54 | [2026-06-11_13-54.md](2026-06-11_13-54.md) | Alinhamento Expo Router, Git, figma-map, backend→front; subagent senior-test-frontend |
| 2026-06-09 17:51 | [2026-06-09_17-51.md](2026-06-09_17-51.md) | Rules/skills Cursor (LGPD, Figma, WCAG, git); análise front; components Figma; próximo subagent |
| 2026-06-03 17:16 | [2026-06-03_17-16.md](2026-06-03_17-16.md) | Polimento docs/Cursor, gitignore session, SSH 443, push concluído |
| 2026-06-03 16:34 | [2026-06-03_16-34.md](2026-06-03_16-34.md) | Skill save-session, `/session`, visibilidade `.cursor` / `cursor/`, salvo manualmente |

*Atualize esta tabela quando criar novos arquivos em `session/`.*
