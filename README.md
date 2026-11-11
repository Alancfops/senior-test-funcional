# Sênior Teste Funcional

Plataforma digital para **fisioterapeutas** acompanharem pacientes idosos com instrumentos funcionais padronizados (histórico, evolução e relatórios).

Este repositório contém o **app mobile** (Expo / React Native, em `frontend/`) usado pelos alunos de fisioterapia da clínica-escola, e a **especificação do produto** em `docs/` (requisitos, protocolos clínicos, LGPD).

| Repositório | Link |
|-------------|------|
| **App mobile** (este) | [github.com/Alancfops/senior-test-funcional](https://github.com/Alancfops/senior-test-funcional) |
| STF API | [github.com/Alancfops/stf-api](https://github.com/Alancfops/stf-api) |
| Gerenciador web | [github.com/Alancfops/senior-test-web](https://github.com/Alancfops/senior-test-web) |

## Sumário

1. [O ecossistema STF](#o-ecossistema-stf)
2. [Arquitetura do sistema](#arquitetura-do-sistema)
3. [Pré-requisitos](#pré-requisitos)
4. [Instalação rápida](#instalação-rápida)
5. [Configuração obrigatória](#configuração-obrigatória)
6. [Makefile — referência](#makefile--referência)
7. [Uso do aplicativo](#uso-do-aplicativo-fluxo-principal)
8. [Recuperação de senha](#recuperação-de-senha-rf003)
9. [Solução de problemas](#solução-de-problemas)
10. [Documentação do produto](#documentação-do-produto)

---

## O ecossistema STF

O STF são três repositórios, clonados lado a lado na mesma pasta:

| Sistema | Quem usa | O que faz |
|---------|----------|-----------|
| **App mobile** (este repo) | Fisioterapeutas (alunos de fisioterapia) | Cadastrar pacientes idosos, aplicar os testes funcionais (TUG, Katz, Berg, Tinetti, MEEM) com tutorial e coleta guiada, ver histórico, gráfico de evolução e PDF de cada avaliação |
| **[STF API](https://github.com/Alancfops/stf-api)** | Os dois clientes | Guarda os dados (PostgreSQL), calcula pontuações e classificações, gera PDFs, envia e-mails, controla permissões e auditoria |
| **[Gerenciador web](https://github.com/Alancfops/senior-test-web)** | Professora e ajudantes | Painel de supervisão de toda a equipe: alunos, pacientes, transferências, exclusões, relatórios e auditoria |

Instrumentos aplicados pelo app: **TUG** (mobilidade), **Katz** (atividades de vida diária), **Berg** (equilíbrio), **Tinetti** (equilíbrio e marcha) e **MEEM** (rastreio cognitivo).

O app não calcula nem interpreta resultados: ele coleta as respostas e mostra o que a API devolve. Cada aluno só vê os próprios pacientes; a visão de toda a equipe fica no gerenciador.

---

## Arquitetura do sistema

```mermaid
flowchart LR
    ALUNO(["👤 Aluno"]) --> APP["App mobile<br/>Expo / React Native"]
    PROF(["👤 Professora / ajudante"]) --> WEB["Gerenciador web<br/>Vite / React"]
    APP -->|"HTTPS + JWT<br/>/auth · /patients · /assessments · /reports"| API
    WEB -->|"HTTPS + JWT<br/>/auth · /admin/*"| API
    subgraph SRV["Servidor"]
        API["STF API<br/>NestJS"]
        DB[("PostgreSQL")]
        FS[/"uploads/<br/>fotos de pacientes"/]
    end
    API -->|Prisma| DB
    API --> FS
    API -->|"Gmail / Resend"| MAIL["✉️ E-mail<br/>recuperação de senha<br/>senha temporária"]
```

| Camada | Onde | Função |
|--------|------|--------|
| **App mobile** | `frontend/` (este repo) | Telas do aluno; token JWT guardado no `expo-secure-store`; dados do servidor via TanStack Query |
| **STF API** | [stf-api](https://github.com/Alancfops/stf-api) | Regras, cálculo dos resultados, PDF, permissões, e-mail |
| **PostgreSQL** | Docker / servidor | Contas, pacientes, avaliações e resultados |

O servidor é a **fonte da verdade** clínica. Detalhes: [docs/engineering/architecture.md](docs/engineering/architecture.md).

---

## Pré-requisitos

| Ferramenta | Versão sugerida | Uso |
|------------|-----------------|-----|
| **Node.js** | 20 LTS ou superior | Backend, frontend e scripts npm |
| **npm** | 10+ | Dependências |
| **Docker** + **Docker Compose** | recente | PostgreSQL local (recomendado) |
| **Git** | qualquer | Clonar o repositório |
| **Expo Go** (opcional) | app na loja | Testar no celular físico |

Sem Docker, é possível apontar `DATABASE_URL` em `../stf-api/.env` para um PostgreSQL já instalado na máquina.

---

## Instalação rápida

Clone os dois repositórios lado a lado:

```bash
git clone git@github.com:Alancfops/stf-api.git
git clone git@github.com:Alancfops/senior-test-funcional.git
cd senior-test-funcional

make setup                    # deps do app + setup da API (.env, Postgres)
make -C ../stf-api migrate    # aplica migrations Prisma (primeira vez)
make start                    # sobe Postgres + API (:3000) + Expo
```

O comando `make start` cria os `.env` a partir dos exemplos (se ainda não existirem), sobe o Postgres, sincroniza o IP da API no frontend e inicia API + Expo. Abre **dois processos** (API e Expo). Para encerrar: **Ctrl+C** no terminal. Para parar só o Postgres: `make stop`.

Dependências novas ou primeira vez no projeto: `make` ou `make install` antes de `make start`.

---

## Configuração obrigatória

### API — `../stf-api/.env`

O `make setup` copia `.env.example` → `.env` no repo da API se ainda não existir. Revise:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Padrão Docker: `postgresql://senior:senior@localhost:5432/senior_test?schema=public` |
| `JWT_ACCESS_SECRET` | Segredo JWT (mín. 32 caracteres). Gere um novo: `make secrets` |
| `MAIL_PROVIDER` | `gmail` (e-mail real), `console` (código no terminal) ou `resend` |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Conta Gmail **dedicada ao projeto** + [senha de app](https://myaccount.google.com/apppasswords) |

Verifique o e-mail: `make -C ../stf-api mail-check`

### Frontend — `frontend/.env`

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_URL` | URL da API **sem barra final** |

**Onde testar:**

| Ambiente | `EXPO_PUBLIC_API_URL` |
|----------|------------------------|
| Web / simulador iOS | `http://localhost:3000` |
| Emulador Android | `http://localhost:3000` (o app converte para `10.0.2.2`) |
| Celular físico (Expo Go) | **`make start` detecta o IP LAN automaticamente** e grava em `frontend/.env` |

Celular e PC devem estar na **mesma rede Wi‑Fi**. Ao mudar de rede (casa ↔ escritório), rode **`make start` de novo** — o IP é atualizado antes do Expo subir.

Para forçar só a sincronização: `make sync-frontend-api-url`. IP manual: edite `EXPO_PUBLIC_API_URL` e reinicie o Expo.

---

## Makefile — referência

Execute `make help` para listar todos os alvos.

| Comando | O que faz |
|---------|-----------|
| `make` / `make install` | `npm install` em `frontend/` |
| `make setup` | install + `.env` do app + `make setup` da API |
| `make start` | `.env` + API (`../stf-api`, `:3000`) + Expo |
| `make start-backend` | Postgres + só a API (watch) |
| `make start-frontend` | Só o Expo |
| `make stop` | Para o Postgres da API |
| `make lint` | Lint do app |
| `make test` | Testes do app |

Banco, migrations, e-mail, segredos e testes da API: `make -C ../stf-api help` (ver README do [stf-api](https://github.com/Alancfops/stf-api)).

---

## Uso do aplicativo (fluxo principal)

1. **Cadastro / login** do fisioterapeuta (RF001–RF002).
2. **Cadastrar paciente** (RF004) — lista em Pacientes (RF005).
3. **Aplicar teste** — escolher instrumento → paciente → tutorial → coleta → finalizar (RF007–RF011).
4. **Ver histórico e gráfico** no perfil do paciente (RF006 / RF012) — gráfico exige ≥ 2 avaliações **do mesmo** instrumento.
5. **Gerar PDF** no detalhe da avaliação finalizada (RF013).

Swagger da API (dev): [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## Recuperação de senha (RF003)

- O código tem **6 dígitos** e expira em **10 minutos**.
- E-mails do Gmail do projeto podem ir para **spam** — confira também Promoções.
- Ao clicar em **Reenviar**, o código anterior é **invalidado**; use só o e-mail **mais recente**.
- Para testes locais **sem depender de e-mail**, use `MAIL_PROVIDER=console` em `../stf-api/.env` — o código aparece no **terminal da API**.
- A API sempre responde “e-mail enviado” mesmo se o endereço não estiver cadastrado (segurança).

---

## Solução de problemas

| Sintoma | O que verificar |
|---------|-----------------|
| Lista de pacientes carregando infinito | IP da API desatualizado — rode `make start` (sincroniza IP) ou `make sync-frontend-api-url`; celular na mesma Wi‑Fi que o PC |
| `ECONNREFUSED` / sem conexão | API rodando? `curl http://localhost:3000/health` |
| Código de senha não chega | Spam; e-mail cadastrado? `make -C ../stf-api mail-check`; ou `MAIL_PROVIDER=console` |
| Código inválido após reenvio | Usar código do **último** e-mail, não de tentativas anteriores |
| Erro de banco na API | `make -C ../stf-api db-up` e `make -C ../stf-api migrate` |
| Porta 5432 ocupada | Outro Postgres local ou container antigo — `make stop` |

---

## Documentação do produto

Índice completo: **[docs/README.md](docs/README.md)**

| Tema | Onde |
|------|------|
| Produto e RFs | [docs/product/](docs/product/) |
| API (comportamento) | [stf-api/docs/backend](https://github.com/Alancfops/stf-api/blob/main/docs/backend/README.md) |
| App mobile | [docs/frontend/README.md](docs/frontend/README.md) |
| LGPD | [docs/product/privacy-and-lgpd.md](docs/product/privacy-and-lgpd.md) |
| Decisões (e-mail, domínio) | [docs/engineering/project-decisions.md](docs/engineering/project-decisions.md) |

Entrada para agentes automatizados: [CLAUDE.md](CLAUDE.md)
