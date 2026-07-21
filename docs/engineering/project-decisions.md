# Decisões de projeto (registro)

Decisões explícitas do titular/equipe que orientam implementação e documentação. **Agentes e PRs devem respeitar** salvo revisão documentada aqui.

---

## 2026-07-21 — Infraestrutura de e-mail (TCC)

**Decisão:** **não comprar domínio** nem registrar DNS para remetente institucional neste ciclo (TCC / entrega acadêmica).

**Implicações para engenharia:**

| Tópico | Escolha adotada |
|--------|------------------|
| Resend com `onboarding@resend.dev` | Apenas teste limitado (destinatário = e-mail da conta Resend); **não** é solução final |
| Domínio + `noreply@seudominio.com.br` | **Fora de escopo** até nova decisão explícita |
| RF003 — código 6 dígitos no app | **Mantido** (Figma + `requirements.md`) |
| Envio transacional sem domínio | **Gmail SMTP** com conta **dedicada ao projeto** (ex.: `no.replystf@gmail.com`), não e-mail pessoal do titular |
| Firebase / Supabase Auth no lugar do Nest | **Não adotado** — auth permanece NestJS + PostgreSQL; e-mail RF003 via `MAIL_PROVIDER=gmail` |
| `MAIL_PROVIDER=console` | Somente CI/offline — **não** apresentação final ao usuário |

**Evolução futura (pós-TCC, se o produto for comercializado):** migrar para provedor transacional + domínio verificado; trocar só `notifications/` e `MAIL_*` — fluxo HTTP e telas RF003 permanecem.

**Referências:** [backend/README.md § RF003](../backend/README.md), [requirements.md RF003](../product/requirements.md), `backend/.env.example`.

---

## Como registrar nova decisão

Adicionar seção com data, decisão, implicações e link para docs/código afetados.
