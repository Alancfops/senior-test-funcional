---
name: session
description: Salva resumo estruturado da conversa atual em session/. Use com /session ou quando o usuário pedir para salvar a sessão.
disable-model-invocation: true
---

# /session — Salvar resumo desta conversa

Execute **agora** a skill do projeto **save-session**, seguindo à risca:

@.cursor/skills/save-session/SKILL.md

Use o template em @.cursor/skills/save-session/reference.md

## Checklist obrigatório

1. Ler `session/` (contexto anterior) se ainda não leu nesta conversa.
2. Resumir **toda** a conversa atual até este momento (pedidos, decisões, arquivos, pendências).
3. Rodar `rtk git status` e `rtk git diff` se houver mudanças no repositório.
4. Criar `session/YYYY-MM-DD_HH-MM.md` (data/hora **agora**; sufixo `_2` se colidir).
5. Atualizar a tabela em `session/README.md` com a nova entrada.
6. Responder em português: caminho do arquivo, resumo em 1 frase, pendências.

## Não fazer

- Commit, push ou apagar arquivos antigos em `session/`.
- Incluir segredos (`.env`, tokens, senhas).
