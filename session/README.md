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
| 2026-08-11 17:00 | [2026-08-11_17-00.md](2026-08-11_17-00.md) | Categorias perfil + tela sessões; ícones por sexo; fix PATCH foto; make start sem install; commit/push; próximo: gerenciador web |
| 2026-08-06 18:01 | [2026-08-06_18-01.md](2026-08-06_18-01.md) | Ícone perfil no form; fix PATCH+foto (body 1mb); plano categorias no histórico (não implementado) |
| 2026-08-06 17:07 | [2026-08-06_17-07.md](2026-08-06_17-07.md) | Edit paciente + splash + iniciais; empty vermelho; sync IP; commit/push `5c358fa` em `develop` |
| 2026-08-03 17:25 | [2026-08-03_17-25.md](2026-08-03_17-25.md) | Loading infinito = IP LAN; `make start` + sync-frontend-api-url; sem commit na época |
| 2026-07-23 16:40 | [2026-07-23_16-40.md](2026-07-23_16-40.md) | RF013 PDF (API+app+protótipo); revisão LGPD §12; explicação aviso/retenção/DPO para analisar depois |
| 2026-07-22 16:55 | [2026-07-22_16-55.md](2026-07-22_16-55.md) | Avaliações clínicas API+app (histórico, gráfico, filtros, atividades); review+fixes; commit amend+push `4863e1c` |
| 2026-07-21 17:44 | [2026-07-21_17-44.md](2026-07-21_17-44.md) | Integração pacientes API (lista/perfil/foto); fix e2e apagando DB; escolaridade obrigatória; commit+push `2731704`; branch feature removida |
| 2026-07-21 17:01 | [2026-07-21_17-01.md](2026-07-21_17-01.md) | Auth RF001–RF003 Gmail projeto; erro RF003 Figma; **RF004 POST /patients** + isolamento; sem domínio (TCC) |
| 2026-07-21 15:50 | [2026-07-21_15-50.md](2026-07-21_15-50.md) | **Sem domínio** (TCC); RF003 Gmail dedicado; decisão em `docs/engineering/project-decisions.md` |
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
