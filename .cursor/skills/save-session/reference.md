# Template — arquivo de sessão

Copie e preencha ao criar `session/YYYY-MM-DD_HH-MM.md`.

```markdown
# Sessão — YYYY-MM-DD HH:MM

**Registrado em:** YYYY-MM-DD HH:MM (timezone: …)  
**Projeto:** senior-test-funcional  
**Gatilho:** save-session (comando do usuário)

---

## Resumo

[2–4 frases: objetivo da conversa e resultado principal.]

---

## O que o usuário pediu

- [pedido 1]
- [pedido 2]

---

## O que foi feito

| Área | Ação |
|------|------|
| Documentação | … |
| Código | … (ou "nenhuma alteração de código") |
| Outro | … |

### Detalhes

- …

---

## Decisões tomadas

- [decisão] — [motivo breve, se relevante]

---

## Arquivos tocados

- `caminho/arquivo.md` — criado / alterado / removido — [uma linha do que mudou]

---

## Pendências / próximos passos

- [ ] …

---

## Contexto para a próxima conversa

[O que o próximo agente deve saber em 3–5 bullets — prioridade alta primeiro.]

---

## Referências

- Links internos: `docs/...`, issues, PRs (se houver)
```

## Exemplo mínimo

```markdown
# Sessão — 2026-06-03 15:42

**Registrado em:** 2026-06-03 15:42 (America/Sao_Paulo)

## Resumo

Expandimos a documentação de backend e frontend; criamos skill save-session.

## O que foi feito

- `docs/backend/README.md` — expandido com fluxos e LGPD
- `.cursor/skills/save-session/` — skill criada

## Pendências

- [ ] OpenAPI em `docs/contracts/`

## Contexto para a próxima conversa

- Repo é só docs; código foi removido da raiz
- Gráficos exigem ≥2 avaliações do **mesmo** instrumento
```
