# Arquitetura planejada — Sênior Teste Funcional

**Público:** equipe de uma pessoa (você).  
**Restrições de produto (PRD/requisitos):** app mobile como canal principal, instrumentos padronizados, histórico, gráficos, PDF, recuperação de senha por e-mail, dados por fisioterapeuta.  
**Restrições técnicas fixas:** cliente em **React Native**.  
**Preferência declarada:** **TypeScript**.

Este documento descreve **como eu estruturaria o sistema para maximizar segurança, manutenibilidade e velocidade de uma pessoa só**, usando TypeScript ponta a ponta. Está **alinhado** ao [PRD.md](./PRD.md) e ao [levantamento-requisitos.md](./levantamento-requisitos.md), sem substituí-los.

---

## 1. Princípios diretores

| Princípio | O que significa aqui |
|-----------|---------------------|
| **Backend é fonte da verdade** | Pontuações, cortes parametrizados, permissão (“só meus pacientes”), PDF estável — tudo validado/persistido no servidor. |
| **Monólito primeiro** | Uma API, um banco — evita dispersão operacional até existir dor real de escala. |
| **TypeScript ponta a ponta** | Menos erro de contrato entre app e API; mesmo idioma nos dois lados facilita onboarding mental (importante sendo solo). |
| **Domínio explícito por instrumentos** | TUG/Katz/Berg/Tinetti/MEEM têm modelos diferentes — separar por módulos/pastas, não uma “mega entidade AvaliacaoGenérica”. |
| **PDF e e-mail no servidor** | Comportamento previsível e layout A4 igual em todos os celulares. |

---

## 2. Visão de alto nível (C4 simplificado)

```mermaid
flowchart TB
    subgraph cliente["📱 Mobile (React Native / Expo)"]
        RN[Aplicativo]
    end

    subgraph nuvem["☁️ Infraestrutura (servidor/API)"]
        API[API TypeScript HTTP]
        DB[(PostgreSQL)]
        MAIL[E-mail transacional SMTP/API]
        PDF[Geração PDF]
    end

    RN -->|"HTTPS REST + JWT"| API
    API --> DB
    API --> MAIL
    API --> PDF
```

**Cliente:** apenas consome APIs; armazena localmente só **tokens** e **cache de leitura** (opcional), nunca autoridade sobre regras de negócio clínicas.

---

## 3. Stack recomendada (solo + TS + RN)

### 3.1 Cliente mobile

| Peça | Escolha sugerida | Motivo |
|------|-----------------|--------|
| Framework | **Expo + React Native** | Menos trabalho nativo inicial, fluxo de build e updates mais simples para uma pessoa. |
| Navegação | **React Navigation** | Padrão de mercado, boa comunidade. |
| Estado servidor | **TanStack Query (React Query)** | Lista de pacientes, histórico, invalidação por mutação — reduz código manual em telas repetitivas. |
| Estado local leve | **Zustand** ou contexto bem pequeno | Fluxo wizard (instrumento → paciente → tutorial → execução) sem Redux pesado. |
| Formulários | **React Hook Form + Zod** | Validações alinhadas ao que o backend já valida (`zod`). |
| Auth em dispositivo | **expo-secure-store** (ou equivalente) | Guardar access/refresh ou sessão sem plain-text em AsyncStorage livre. |
| HTTP | **fetch ou ky** centralizado em um cliente com interceptadores | Injeta Bearer, tratamento de 401/conflito básico. |

**Bare React Native:** só vale a pena se você **cedo** precisar de libs nativas que o Expo gerencia mal (improvável no MVP da PRD).

### 3.2 Backend (API)

| Peça | Escolha principal | Alternativa más leve |
|------|-------------------|----------------------|
| Runtime | **Node.js LTS** | Idem |
| Framework | **NestJS** — módulos por domínio (auth, therapists, patients, assessments, instruments) | **Fastify + @fastify/jwt + plugins próprios** — menos estrutura, mais manual |
| ORM | **Prisma + PostgreSQL** | **Drizzle** — mesmo espírito, SQL mais próximo |

**Por que NestJS + Prisma na minha recomendação “padrão” para você:**

- **Um dev só**: a estrutura de módulos e injeção de dependência obriga lugares óbvios para novas rotas e evita arquivo “megazord”.
- **Prisma**: migrações versionadas (`prisma migrate`) e tipos gerados combinam bem com cliente TS e com evolução de schema (instrumentos/versionamento).
- Se em alguma sprint você achar Nest “pesado demais”, a **fronteira bem desenhada** (REST OpenAPI/Zod por rota) permite trocar o framework sem reescrever o app.

### 3.3 Banco de dados

**PostgreSQL** em ambiente hospedado (Neon, Supabase só como Postgres, RDS, Railway, Render, Fly — qualquer um que você preferir mantendo backup simples).

### 3.4 PDF

| Abordagem | Quando usar |
|-----------|--------------|
| **Servidor gerando PDF** (recomendado) — ex.: `@react-pdf/renderer` no Node, Puppeteer/Chromium para HTML→PDF ou bibliotecas tipo PDFKit templates | MVP alinhado à PRD: layout A4 idêntico, assinatura/carimbo, gráficos reproduzíveis |
| Cliente só gera arquivo “local” sem servidor | Mais risco de divergência iOS/Android e mais trabalho sua em dupla manutenção |

### 3.5 E-mail (recuperação de senha)

Provedores transacionais com API simples (ex.: **Resend**, AWS SES via SMTP/API, SendGrid — escolha por custo/região). O app não envia e-mail; só chama a API que agenda o envio.

---

## 4. Organização do repositório (monorepo)

Para um dev solo, um **pnpm workspace** único tende a ser mais rápido que dois repositórios separados quando você mexer em contratos o dia inteiro:

```
/apps
  /mobile           # Expo (React Native)
  /api              # NestJS (ou Fastify)
/packages
  /shared-contracts # Zod schemas + tipos gerados/compartilhados (opcional mas útil)
  /eslint-config    # Opcional — padronizar lint entre api e mobile
```

**Fluxo típico de mudança:** alterar schema Zod/compartilhado → atualizar validação backend → atualizar formulário RN com o mesmo shape.

Se você **odear** workspaces, dois repositórios (`mobile` + `api`) também funcionam; o custo é duplicar versionamento de DTO ou gerar cliente OpenAPI (mais trabalho inicial).

---

## 5. Módulos de domínio (API)

Orientação modular alinhada aos RFs e ao fluxo `instrumento → paciente → tutorial → execução → feedback`:

| Módulo | Responsabilidades |
|--------|---------------------|
| **Auth** | Registro/login, hashing (Argon2/bcrypt), JWT access+refresh ou sessão persistida conforme você preferir revisar segurança, recuperação RF003 |
| **Therapists / Users** | Perfil profissional, associações |
| **Patients** | CRUD por `therapistId`, inclusão escolaridade para MEEM |
| **Instrument catalog** | Lista RF007 — metadados (nome, autores), versão textual do tutorial quando não estiver só no cliente |
| **Assessments** | Sessões: qual instrumento, qual paciente, timestamps, payloads por tipo (`tug_sessions`, estruturas Katz/… ou JSON validado strict + colunas pesquisáveis onde fizer sentido) |
| **Scoring rules** | Tabelas de corte parametrizadas (versão/versionTag) aplicadas pelo servidor ao finalizar |
| **Reporting** | Gera PDF, URL assinada temporária ou stream download |
| **Notifications** | Enfileiramento leve ou chamada síncrona ao provedor para token de recuperação |

**MEEM:** persistir sempre `schoolingInterpretationBand` ou similar **na própria linha da avaliação** (valor usado nos cortes após confirmar/corrigir na sessão), conforme especificação do levantamento.

---

## 6. Fluxos relevantes

### 6.1 Autenticação (RF001–RF003)

```
Mobile → POST /auth/login → API valida → retorna tokens
Mobile guarda tokens no Secure Storage
Calls subsequentes: Authorization: Bearer <access>

Refresh + rotação: recomendável para vida longa sem relog frequente — implementar quando já tiver primeira versão usável do resto.
```

Recuperação: `POST /auth/forgot-password` → gera código 6 dígitos, TTL 10 min, invalida uso único conforme RF003.

### 6.2 Nova avaliação (RF007–RF011)

```
GET /instruments          → lista alfabética + autores
POST /assessments/draft   → cria sessão incompleta (opcional mas útil para salvar racional)
PATCH ou PUT por etapa    → persiste payloads parciais (reduz “perdi tudo ao fechar o app”) — opcional MVP
POST /assessments/:id/finalize → servidor recalcula score, aplica cortes, retorna classification

Mobile mostra resultado (RF011) e links para histórico / PDF.
```

Persistência parcial (rascunho) **não** está obrigada no PRD, mas para uma pessoa no campo é um **ótimo segundo passo** após MVP mínimo.

### 6.3 Gráfico (RF012)

API expõe `GET /patients/:id/instruments/:code/timeseries` retornando `[{ date, rawValue, label }]`. O app só desenha (Recharts não roda nativo sem WebView — usar **Victory Native**, **React Native SVG** + próprio, ou libs como `gifted-charts` conforme gosto).

### 6.4 PDF (RF013)

`POST /reports/assessment/:assessmentId` ou `GET` com JWT que gera e devolve arquivo. Opcionalmente grava arquivo em objeto (S3) se quiser reaproveitar o mesmo arquivo — para MVP pode ser só geração on-the-fly.

---

## 7. Segurança e privacidade (mínimos sensatos)

Mesmo antes de formalizar RS/RNF no documento de requisitos:

- HTTPS obrigatório em produção.  
- Senhas com hash forte server-side (**Argon2id** quando disponível via lib).  
- **Todas as queries escopadas** por `therapistId` derivado do token — nunca confiar apenas em IDs mandados pelo cliente.  
- Armazenar **IP** opcional apenas se necessário; foco LGPD pragmático: só dados que o MVP precisa + política futura explícita.  
- Tokens de recuperação **hasheados no banco** (igual reset token best practice).

---

## 8. Ambientes e deploy (proposta objetiva para solo)

| Camada | Sugestão prática |
|--------|------------------|
| **API + worker leve** (se fila futura) | Railway, Fly.io, Render, ou VPS simples |
| **Postgres gerenciado** | Neon ou Supabase (Postgres apenas) ou o mesmo provedor da API |
| **Mobile distribuição interna** | Expo EAS Build + distribuição ad hoc / Internal testing |
| **CI** | GitHub Actions só quando doer — inicialmente pode ser deploy manual |

Variáveis `.env`: `DATABASE_URL`, `JWT_SECRET`, `SMTP ou RESEND_*`, buckets se usar.

---

## 9. Fases de construção (encaixa no roadmap da PRD)

1. **Fundação**: DB + Auth + Patients (RF001–RF005) funcionando pela API + telas RN básicas.  
2. **Núcleo de avaliação**: um instrumento end-to-end (sugiro **TUG**, mais simples) em RF007–RF011.  
3. **Demais instrumentos**: repetir padrão de módulos/payload/schema. MEEM por último por refino escolaridade.  
4. **Histórico + gráfico + PDF** (RF006, RF012, RF013).  
5. **Endurecer**: rate limit, auditoria mais rica, políticas quando RNF/RS entrarem no escopo oficial.

---

## 10. O que eu **evitaria** neste cenário solo

| Armadilha | Por quê |
|----------|---------|
| GraphQL no MVP | Boilerplate maior para uma pessoa que precisa CRUD bem definido por RF. REST + Zod costuma bastar. |
| Microserviços | Sobrecarga operacional desproporcional. |
| Lógica de pontuação só no cliente | Divergência, fraude benigna/acidental, relatório inconsistente. |
| Backend em linguagem só “por hype” quando você já quer TS | Você já favorece TS; tirar tipo compartilhado sem ganho forte atrapalha ritmo solo. |

---

## 11. Próximo passo de documentação

Quando você for implementar, vale acrescentar **dois artefatos curtos**:

1. **Diagrama ER** inicial ( Therapist, Patient, Assessment, payloads por tipo ).  
2. **Contrato OpenAPI** ou coleção Bruno/Insomnia — mantém você honesto contra os próprios RFs quando voltar dias depois.

---

## Referências internas

- [PRD.md](./PRD.md) — visão produto e prioridades  
- [levantamento-requisitos.md](./levantamento-requisitos.md) — RF001–RF013 em detalhe  
- `docs/testes/*` — regras clínicas e textos tutor (fonte auxiliar ao domínio)  
