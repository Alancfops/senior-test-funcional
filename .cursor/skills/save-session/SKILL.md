---
name: save-session
description: Registra resumo em Markdown da conversa atual na pasta session/ com data e hora. Use quando o usuário pedir /session, /save-session, salvar sessão, guardar o que falamos, rastrear conversa ou registrar o histórico do chat. Ao iniciar trabalho no repositório, lê session/ para contexto de sessões anteriores.
---

# Salvar sessão de conversa

Registra o que foi discutido e feito **até o momento do comando**, em `session/`, para rastreamento ao longo do tempo.

## Ao começar qualquer tarefa neste repositório

1. Liste `session/` (ordenar por nome ou data, mais recente primeiro).
2. Leia os **1–3** arquivos `.md` mais recentes antes de planejar ou editar.
3. Não repita trabalho já concluído nem contradiga decisões documentadas ali, salvo pedido explícito do usuário.

## Quando o usuário invocar esta skill

Execute na ordem:

### 1. Coletar contexto

- Percorra a conversa **desta sessão** (do início até agora).
- Inclua: pedidos do usuário, decisões, arquivos criados/alterados/removidos, comandos relevantes, pendências e bloqueios.
- Se houver `git status` / `git diff` úteis, rode `rtk git status` e `rtk git diff` para listar mudanças no disco.

### 2. Nome do arquivo

Use a data/hora **do momento do comando** (fuso do usuário ou UTC se não souber — documente qual usou no corpo):

```
session/YYYY-MM-DD_HH-MM.md
```

Exemplo: `session/2026-06-03_15-42.md`

- Se o arquivo já existir (mesmo minuto), acrescente sufixo: `session/2026-06-03_15-42_2.md`
- Não sobrescreva arquivos anteriores.

### 3. Escrever o Markdown

Use o template em [reference.md](reference.md). Idioma: **português**.

Regras:

- Seja **factual** — o que foi feito, não intenções vagas.
- Cite caminhos de arquivos com backticks.
- Separe **decisões** de **tarefas ainda abertas**.
- Se nada foi alterado no repo, diga explicitamente.

### 4. Confirmar ao usuário

Responda com:

- Caminho do arquivo criado
- Uma linha de resumo (1 frase)
- Lista curta de pendências, se houver

## O que não fazer

- Não commitar nem fazer push (salvo pedido separado).
- Não incluir segredos (tokens, `.env`, senhas).
- Não duplicar o transcript bruto do Cursor — só resumo estruturado.
- Não apagar entradas antigas em `session/`.

## Pasta session/

- Vive na **raiz do repositório**: `session/`
- Arquivos `session/*.md` **não vão para o git** (histórico local; ver `.gitignore`).
- Índice opcional: manter `session/README.md` (versionado) com tabela das últimas entradas (atualizar ao salvar, se já existir).

## Recursos

- Template completo: [reference.md](reference.md)
