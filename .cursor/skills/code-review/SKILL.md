---
name: code-review
description: Reviews code changes for the Senior Teste Funcional project using Bugbot and Security Review subagents plus project checklists (LGPD, therapist isolation, server-side scoring, OpenAPI). Use when the user asks for code review, revisão de código, review PR/branch, or before merging backend/frontend changes.
disable-model-invocation: true
---

# Code Review — Senior Teste Funcional

Revisão de código **específica deste projeto**: subagents Cursor + checklist de domínio (saúde, LGPD, API como fonte da verdade).

**Somente quando o usuário pedir** — não revisar por iniciativa própria após cada edit.

## Escopo da revisão

Se o usuário não especificar, use **AskQuestion** (ou pergunte) com opções:

| Opção | O que roda |
|-------|------------|
| **Completa (recomendado)** | Security Review + Bugbot + checklist do projeto |
| **Segurança** | Security Review + checklist § Segurança/LGPD |
| **Bugs / lógica** | Bugbot + checklist § Domínio clínico e API |

Para mudanças em `auth`, `patients`, `assessments`, JWT ou PDF → preferir **Completa** ou **Segurança**.

## Fluxo obrigatório

```
Task Progress:
- [ ] 1. Identificar diff alvo (branch vs uncommitted)
- [ ] 2. Ler session/ recente se existir contexto de RF
- [ ] 3. Rodar subagent(s) conforme escopo
- [ ] 4. Aplicar checklist do projeto ([reference.md](reference.md))
- [ ] 5. Consolidar relatório único (template abaixo)
- [ ] 6. Não corrigir código salvo pedido explícito
```

### Passo 1 — Diff alvo

| Pedido do usuário | `Diff` no prompt do subagent |
|-------------------|------------------------------|
| Padrão / branch atual | `branch changes` |
| Só working tree local | `uncommitted changes` |

Repositório: caminho absoluto do workspace (`/home/alan/myProjects/senior-test-funcional` ou raiz ativa).

Se o usuário citar PR ou branch específica → checkout antes de lançar subagent (mesma regra das skills globais `review-bugbot` / `review-security`).

### Passo 2 — Subagents

Lançar **um subagent por tipo**, nunca misturar tipos no mesmo prompt:

**Security Review** (`subagent_type: "security-review"`):

```text
Full Repository Path: <absolute path>
Diff: <branch changes | uncommitted changes>
Custom Instructions: Senior Teste Funcional — health data (TUG/Katz/Berg/Tinetti/MEEM), therapist_id isolation, JWT, password reset tokens, PDF access control, no clinical payload in logs.
```

**Bugbot** (`subagent_type: "bugbot"`):

```text
Full Repository Path: <absolute path>
Diff: <branch changes | uncommitted changes>
Custom Instructions: Senior Teste Funcional — scoring only on finalize, instrument-specific Zod schemas, Katz stratum = count of D, MEEM uses schooling_band_used from session.
```

Parâmetros comuns: `readonly: true`, `run_in_background: false`.

Se subagent falhar por prompt incorreto → corrigir e retry **uma vez**. Persistindo → reportar blocker ao usuário.

### Passo 3 — Checklist do projeto

Após subagents, percorrer [reference.md](reference.md) nas seções relevantes ao diff (backend, frontend, docs com impacto em contrato).

Marcar cada item: ✅ ok · ⚠️ risco · ❌ falha · ➖ não aplicável.

### Passo 4 — Relatório consolidado

Responder em **português** com:

```markdown
# Code Review — [escopo] — [branch ou "uncommitted"]

## Resumo
[1–3 frases: merge-ready? bloqueadores?]

## Subagents
| Fonte | Achados |
|-------|---------|
| Security Review | N issues / tabela |
| Bugbot | N issues / tabela |

## Checklist projeto
| Área | Status | Nota |
|------|--------|------|

## Bloqueadores (must fix)
- …

## Sugestões (should fix)
- …

## Nice to have
- …
```

Tabelas de subagents: colunas **Severity**, **Location (file:line)**, **Finding** — severidade decrescente.

## Áreas de atenção rápida

| Área alterada | Foco extra |
|---------------|------------|
| `auth/` | Mensagem genérica login; hash Argon2id; TTL reset 10 min; token invalidado |
| `patients/` | `therapist_id` em toda query; MEEM schooling no cadastro |
| `assessments/` | Scoring só no `finalize`; DRAFT vs FINALIZED; Zod por `instrument_code` |
| `reports/` | PDF só do dono; gráfico ≥2 do mesmo instrumento |
| `frontend/` | Sem scoring local; API real; WCAG se UI; rule `figma-screens-required` |
| `docs/contracts/` | Snapshot alinhado à implementação |

## Referências

- Checklist detalhado: [reference.md](reference.md)
- Exemplos de pedido: [examples.md](examples.md)
- LGPD: rule `lgpd-sensitive-data-review` + [docs/product/privacy-and-lgpd.md](../../../docs/product/privacy-and-lgpd.md)
- Domínio API: [docs/backend/README.md](../../../docs/backend/README.md)

## Não fazer

- Commit, push ou aplicar fixes sem pedido
- Substituir assessoria jurídica LGPD
- Aprovar merge com isolamento `therapist_id` quebrado ou scoring no cliente
