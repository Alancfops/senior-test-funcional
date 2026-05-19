# Documentação — Sênior Teste Funcional

Este diretório concentra **comportamento esperado do produto**, **decisões técnicas**, **contratos (artefatos machine-readable)** e **referência clínica** — separados de propósito para reduzir ambiguidade.

A **arquitetura do software** descrita para leitura pública — sem detalhar segredos, credenciais ou políticas operacionais de produção — está no **[README na raiz do repositório](../README.md)** (seção sobre arquitetura em camadas e princípios).

**Condensado (espelho do README principal):**

| Aspecto | Resumo |
|---------|--------|
| Componentes | **App mobile** (React Native / Expo) → **API** (implementação sob `backend/`) → **Postgres**. |
| Onde ficam as regras principais | API valida permissões por profissional, persiste avaliações e apoio a relatório conforme especificação de produto em `produto/`. |
| Clínico vs sistema | **`protocolos-clinicos/`** = texto de apoio; **`produto/`** = obrigações de software (RF). |
| Fluxo técnico de entrega | Fases descritas em `engenharia/repositorio-e-fluxo-desenvolvimento.md` (**A→E**), com prioridade inicial ao backend. |

---

## Como navegar (leitura mínima)

| Se você quer… | Comece por… |
|----------------|-------------|
| Entender produto MVP, fluxos, mapa rápido de RFs | [produto/PRD.md](produto/PRD.md) |
| Implementar comportamento campo a campo (**RF001+**) | [produto/levantamento-requisitos.md](produto/levantamento-requisitos.md) |
| Stack, limites Backend/Front, Postgres, Bun, fases **A→E** | [engenharia/arquitetura.md](engenharia/arquitetura.md) + [engenharia/repositorio-e-fluxo-desenvolvimento.md](engenharia/repositorio-e-fluxo-desenvolvimento.md) |
| ER e glossário antes de migrações | [engenharia/modelo-de-dados.md](engenharia/modelo-de-dados.md) |
| Regras de **aplicação** dos testes na prática | [protocolos-clinicos/](protocolos-clinicos/README.md) |

## Mapa das pastas (arquitetura da informação)

```
docs/
├── README.md                 ← você está aqui (índice canônico)
├── produto/                  O quê — PRD sintético + especificação funcional detalhada (RFs)
├── engenharia/               Como — código, infra, modelo de dados, fluxo mono-repo/dev
├── protocolos-clinicos/      Roteiros de instrumentos na prática (complementam, não substituem, os RFs)
└── contratos/                Artefatos de integração formais — OpenAPI, exemplos payloads (quando houver código)
```

**Princípios:**

1. **`produto`** ≠ **`protocolos-clinicos`**: RFs dizem **o que o sistema obriga**; protocolos dizem **como o aplicador faz o teste fisicamente** e citam literatura — podem divergir levemente de UI implementada, mas devem estar alinhados no **cálculo** e cortes parametrizados.  
2. **`engenharia`** evita repetir páginas longas de RF — atualiza comportamento técnico e aponta de volta para `produto/` quando houver inconsistência registrada em issue/decisão.  
3. **`contratos/`** separa o que é “intenção” do que é **forma explícita** da API (OpenAPI, exemplos de payload); até existir scaffold, há só um README‑placeholder honesto.

---

## Índice detalhado

### Produto

| Doc | Finalidade |
|-----|-------------|
| [produto/PRD.md](produto/PRD.md) | Visão, escopo, personas, roadmap, síntese de RFs |
| [produto/levantamento-requisitos.md](produto/levantamento-requisitos.md) | Casos uso tabulados **RF001–RF013**, regras, matrizes placeholders acadêmico |

Opcional arquivo Word legado (se presente neste disco): tratá‑lo como cópia; **fonte atual** deve ser sempre os `.md` em `produto/`.

### Engenharia

| Doc | Finalidade |
|-----|------------|
| [engenharia/arquitetura.md](engenharia/arquitetura.md) | Decisões técnicas alto nível stack + fronteiras + anti‑padrões |
| [engenharia/modelo-de-dados.md](engenharia/modelo-de-dados.md) | Diagrama ER + glossário relacionais Postgres |
| [engenharia/repositorio-e-fluxo-desenvolvimento.md](engenharia/repositorio-e-fluxo-desenvolvimento.md) | Pastas código, Bun workspaces, Git leve + **fases A→E** |

### Referência clínica

Ver [protocolos-clinicos/README.md](protocolos-clinicos/README.md). Caminho base por instrumento:

`protocolos-clinicos/instrumentos/<código>/` onde `<código>` ∈ `tug | katz | berg | tinetti | meem`.

### Contratos futuros

[contratos/README.md](contratos/README.md)

---

## Correções relativas ao layout anterior (“plano médio”, imparcial)

| Antes | Por quê mudou |
|-------|----------------|
| Markdown de produto e engenharia soltos na raiz de `docs/` | Mistura “o quê” e “como” no mesmo nível; dificulta roteiros de leitura e onboarding |
| Pasta `testes/` | Conflito com “testes” de software automatizado (**Jest**, **Vitest**, etc.) → passou para **`protocolos-clinicos/instrumentos/`** |
| OpenAPI só mencionado inline | Pasta dedicada **`contratos/`** cria espaço óbvio p/ artifact machine‑readable |

---

## Exemplos de caminho (evitar links quebrados)

A partir da **raiz** do repositório `senior-test/`:

- Índice: `docs/README.md`
- MEEM (roteiro completo): `docs/protocolos-clinicos/instrumentos/meem/avaliar.md`

---

## Manutenção

> **Docs vivas.** PRD/Levantamento seguem declarando poder de mudança; engenharia acumula só decisões efetivamente adotadas.

Quando atualizar comportamento oficial: **primeiro `produto/`**, depois ajustes em `protocolos/` (se texto clínico) e finalmente migrações & OpenAPI dentro de código / `contratos/`.
