# Repositório, separação Backend / Frontend e fluxo de trabalho

Este documento formaliza **como o projeto versionado será organizado** e **qual ordem de entrega preserva custo e conformidade**:

- **API** e **app** como dois artefatos implantáveis independentes (documentados em [`../backend/README.md`](../backend/README.md) e [`../frontend/README.md`](../frontend/README.md));
- **Prioridade atual (2026):** implementar **telas do Figma no app** com navegação, validação client-side e **mocks controlados**, **antes** de codificar e integrar o backend em larga escala;
- **Backend** em seguida: domínio, regras, persistência e **contratos HTTP** — integração substituindo mocks na **Fase D**.

Complementos obrigatórios: [architecture.md](./architecture.md), [PRD.md](../product/PRD.md), [requirements.md](../product/requirements.md), [privacy-and-lgpd.md](../product/privacy-and-lgpd.md).

> **Nota histórica:** versões anteriores deste doc priorizavam backend (Fase A) antes do app. A decisão vigente é **frontend → backend → integração** (ver §3).

---

## 1. Estrutura do repositório

```
senior-test-funcional/
├── README.md
├── docs/                              # Especificação
│   ├── product/
│   ├── backend/
│   ├── frontend/
│   ├── engineering/
│   ├── clinical-protocols/instruments/
│   └── contracts/
├── backend/                           # NestJS + Prisma (Fase B→C)
├── frontend/                          # Expo + RN (Fase A; integração Fase D)
└── packages/                          # Opcional: shared-contracts (Zod)
```

**Implementação (decisão adotada):** monorepo na raiz com `backend/`, `frontend/` e opcional `packages/` (Bun workspaces), conforme [architecture.md](./architecture.md). Repositórios separados só com ADR explícito — **OpenAPI** e **semver** da API permanecem obrigatórios quando o backend existir. A documentação em `docs/backend/` e `docs/frontend/` continua válida como especificação de comportamento.

### 1.1 Toolchain prevista (quando houver código)

Stack e monorepo leve descritos em **[architecture.md](./architecture.md)** (Bun workspaces, NestJS, Expo).

---

## 2. Hierarquia de prioridades (roteiro vigente)

| Ordem | Foco | Objetivo |
|-------|------|----------|
| **1** | **Frontend (Figma):** telas RF, Expo Router, tokens, componentes, mocks | Validar UX, fluxos e handoff visual antes de travar contratos HTTP |
| **2** | **Backend fundação:** Postgres, auth, pacientes, OpenAPI (RF001–RF005) | API testável via HTTP; regras e `therapist_id` no servidor |
| **3** | **Backend avaliações:** instrumentos, finalize, timeseries, PDF (RF007–RF013) | Scoring e PDF **só no servidor** |
| **4** | **Integração:** trocar mocks por API real, RF a RF | Ciclo comportamental oficial app ↔ API |
| **5** | **Polish visual:** animações, microcopy, refinamentos WCAG | Melhor UX **sem** alterar contrato HTTP sem necessidade |

**Invariantes (não mudam com a ordem de entrega):**

- O comportamento **oficial** de negócio, scoring e PDF continua sendo do **servidor** quando a API existir ([backend-server-authority](../../.cursor/rules/backend-server-authority.mdc)).
- Mocks no app são **temporários** na Fase A: não simular classificação clínica, score parcial (MEEM/Katz) ou PDF montado no cliente.
- A OpenAPI, quando publicada, passa a ser fonte técnica de verdade para integração (Fase D).

### 2.1 Fatia vertical por tela (decisão de entrega)

Quando a equipe for **implementar a tela de um RF**, a ordem **atual** é:

| Passo | Camada | Entregável mínimo |
|-------|--------|-------------------|
| **1** | **Frontend** | Rota Expo Router + UI conforme frame Figma; validação RHF + Zod; **mock** explícito (auth, listas, cadastro) onde a API ainda não existir |
| **2** | **Backend** | Rotas, validação e persistência do RF; contrato na OpenAPI (Fases B ou C, conforme o RF) |
| **3** | **Integração** | Remover mock daquele RF; estados loading, erro, 401; TanStack Query contra API real (Fase D) |

**Regras:**

- Mapa visual RF ↔ rota ↔ frame: [figma-map.md](../frontend/figma-map.md).
- Telas só conforme Figma (rule `figma-screens-required`); **comportamento** conforme `docs/product/` e `docs/frontend/`.
- Marcar no handoff e no `figma-map` o que está **UI + mock** vs **integrado à API**.
- **Proibido** mock fixo de classificação ou payload clínico que engane QA quando a integração começar.

---

## 3. Fases A→E — roteiro adotado

### Fase A — Frontend UI (Figma + mocks) — **em andamento**

- Telas dos RFs conforme arquivo Figma oficial (`mtMbhRez2Xy2k414cfzcFm`).
- Navegação `(auth)` / `(main)`, tab bar, formulários com validação client-side.
- **Mocks controlados:** auth (`EXPO_PUBLIC_MOCK_AUTH`), listas, cadastros — dados estáticos ou memória local, **sem** fingir scoring/PDF.
- Tokens, componentes reutilizáveis, WCAG 2 AA baseline ([frontend README §12](../frontend/README.md)).

**Entrega esperada:** app navegável e fiel ao Figma; produto demonstrável **sem** backend.

### Fase B — Backend fundação (`RF001`–`RF005`)

- Schema PostgreSQL inicial ([data-model.md](./data-model.md)).
- Registro, login e recuperação (token TTL, invalidações — [`RF003`](../product/requirements.md)).
- CRUD de pacientes vinculado ao terapeuta; campos MEEM no cadastro.
- Swagger/OpenAPI em desenvolvimento **ou** `openapi.yaml` versionado pela build CI.

**Entrega esperada:** servidor homologável via Postman/Insomnia **sem** depender do app.

### Fase C — Avaliações no servidor (`RF007`–`RF013`)

Instrumentos na ordem acordada; **padrão** costuma iniciar pelo **TUG** (payload mais contido antes de Katz/Berg/Tinetti/**MEEM**).

- Lista canônica de instrumentos (`GET /instruments`).
- Recálculo de pontuações e cortes sempre **pelo servidor** ao finalizar a sessão.
- Séries temporais para gráfico e geração de PDF com semânticas estáveis.

**Saída:** contrato público para integração dos fluxos de avaliação já desenhados no app (Fase A).

### Fase D — Integração frontend ↔ API

- Substituir mocks por chamadas reais, RF a RF (auth → pacientes → wizard → finalize → PDF).
- TanStack Query, tratamento de 401, loading/vazio/erro rede.
- Alinhar tipos/forms ao OpenAPI (ou `packages/shared-contracts`).

**Entrega esperada:** app em produção interna usando API como fonte da verdade.

### Fase E — Harmonização de interface

Refactors majoritariamente visuais (animações, microcopy, polish) **sem** alterar contratos HTTP enquanto o produto oficial não registrar novo RF.

---

## 4. Comunicação tecnológica entre Backend e Frontend

```mermaid
sequenceDiagram
    participant UX as Frontend (RN Expo)
    participant API as backend/ API HTTPS
    participant DB as PostgreSQL

    Note over UX: Fase A — mocks locais; sem API obrigatória
    Note over UX,DB: Fase D — REST + JSON + Bearer JWT

    UX->>API: REST + JSON + Bearer JWT
    API->>DB: Operações filtradas por therapist autenticado
    API-->>UX: Respostas segundo OpenAPI (`v1` ou semver)
```

Na **Fase A**, o cliente pode operar só com mocks. A partir da **Fase D**, consome apenas contratos atualizados; a OpenAPI no servidor é **fonte técnica de verdade**, salvo espelhos em `docs/contracts/`. Opcional: codegen ou Zod compartilhado em `packages/`.

---

## 5. Artefatos de design e alinhamento de domínios

Mapa oficial RF ↔ rota ↔ frame Figma: [figma-map.md](../frontend/figma-map.md).

Ao implementar telas (Fase A) ou integrar (Fase D):

1. Conceitos de domínio (Paciente, Instrumento, Sessão, Resultados) refletidos na UI conforme `docs/product/`.
2. Restrições de fluxo da PRD: wizard, bloqueios de finalização, proibição de feedback antecipado (MEEM, etc.).
3. PDF e e-mail de recuperação **sempre no servidor** quando existirem (app só consome blob/link).

Fluxos com dados pessoais/saúde: coerência com **[privacy-and-lgpd.md](../product/privacy-and-lgpd.md)** antes de ambientes com titulares reais.

---

## 6. Gestão Git e integração contínua

Fluxo **Git Flow simplificado** (skill Cursor `git-branching` em `.cursor/skills/git-branching/`).

| Branch | Papel |
|--------|--------|
| **`main`** | Estável / pronta para release; sempre compilável quando houver código |
| **`develop`** | Integração do dia a dia; base para novas funcionalidades |
| **`feature/*`** | Nova funcionalidade — ex.: `feature/mobile-home-rf005`, `feature/backend-auth-rf002` |
| **`hotfix/*`** | Correção urgente em produção (base: `main`) |
| **`docs/*`** | Só documentação (`docs/`, specs, AGENTS) |
| **`fix/*`** | Bug não urgente (base: `develop`) |
| **`chore/*`** | Tooling, CI, deps, `.cursor/` |

**Convenção de nome:** `<prefix>/<escopo>-<descricao-curta>` — inglês, kebab-case. Escopos sugeridos: `backend`, `frontend`, `mobile`, `auth`, `patients`, `assessments`, `contracts`, `cursor`.

**Regra:** trabalho de funcionalidade **não** commita direto em `develop`/`main` — abrir branch temática primeiro. Commits: Conventional Commits em inglês (skill `conventional-commits`).

**Branch `develop`:** base de integração para features; criada a partir de `main`.

| Prática adicional | Descrição |
|-------------------|-----------|
| **Recursos incompletos** | Mocks na Fase A devem estar **rotulados** (env, comentário, `figma-map`); substituir na Fase D |

Exemplo CI: `{ backend: bun run lint && bun test }, { frontend: bun run lint && npx expo doctor }` (adaptar aos `scripts` quando existir).

---

## 7. Artefatos mínimos enquanto crescer

| Artefato | Onde guardar |
|----------|---------------|
| OpenAPI oficial / snapshots semver | Swagger runtime + opcional `docs/contracts/` |
| Mapa telas mock vs integradas | [figma-map.md](../frontend/figma-map.md) |
| Changelog técnico | `CHANGELOG.md` na raiz ou releases Git |

---

## 8. Referências cruzadas

- [data-model.md](./data-model.md)
- [architecture.md](./architecture.md)
- [../backend/README.md](../backend/README.md) · [../frontend/README.md](../frontend/README.md) · [../frontend/figma-map.md](../frontend/figma-map.md)
- [PRD.md](../product/PRD.md), [requirements.md](../product/requirements.md), [privacy-and-lgpd.md](../product/privacy-and-lgpd.md)

---

*Documentação viva.* Atualizado em **2026-07** para refletir entrega **frontend primeiro**, backend e integração em seguida.
