# Sênior Teste Funcional

Plataforma digital para **fisioterapeutas** acompanharem pacientes idosos com instrumentos funcionais padronizados (histórico, evolução e relatórios).

Monorepo com **API NestJS** (`backend/`), **app Expo/React Native** (`frontend/`) e especificação em **`docs/`**.

---

## Pré-requisitos

| Ferramenta | Versão sugerida | Uso |
|------------|-----------------|-----|
| **Node.js** | 20 LTS ou superior | Backend, frontend e scripts npm |
| **npm** | 10+ | Dependências |
| **Docker** + **Docker Compose** | recente | PostgreSQL local (recomendado) |
| **Git** | qualquer | Clonar o repositório |
| **Expo Go** (opcional) | app na loja | Testar no celular físico |

Sem Docker, é possível apontar `DATABASE_URL` em `backend/.env` para um PostgreSQL já instalado na máquina.

---

## Instalação rápida

Na raiz do repositório:

```bash
git clone <url-do-repositorio> senior-test-funcional
cd senior-test-funcional

make setup      # instala deps, cria .env e sobe Postgres
make migrate    # aplica migrations Prisma (primeira vez)
make start      # instala deps, sobe Postgres + API (:3000) + Expo
```

O comando `make start` **instala dependências que faltam** (`npm install` em `frontend/` e `backend/`), cria os `.env` a partir dos exemplos (se ainda não existirem), sobe o Postgres e inicia API + Expo. Abre **dois processos** (API e Expo). Para encerrar: **Ctrl+C** no terminal. Para parar só o Postgres: `make stop`.

---

## Configuração obrigatória

### Backend — `backend/.env`

O `make setup` copia `backend/.env.example` → `backend/.env` se ainda não existir. Revise:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Padrão Docker: `postgresql://senior:senior@localhost:5432/senior_test?schema=public` |
| `JWT_ACCESS_SECRET` | Segredo JWT (mín. 32 caracteres). Gere um novo: `make secrets` |
| `MAIL_PROVIDER` | `gmail` (e-mail real), `console` (código no terminal) ou `resend` |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Conta Gmail **dedicada ao projeto** + [senha de app](https://myaccount.google.com/apppasswords) |

Verifique o e-mail: `make mail-check`

### Frontend — `frontend/.env`

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_URL` | URL da API **sem barra final** |
| `EXPO_PUBLIC_MOCK_AUTH` | `false` para usar a API real |

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
| `make` / `make install` | `npm install` em `frontend/` e `backend/` |
| `make setup` | install + copia `.env` + `make db-up` |
| `make start` | Instala deps + `.env` + Postgres + API NestJS (`:3000`) + Expo |
| `make start-backend` | Postgres + só a API (watch) |
| `make start-frontend` | Só o Expo |
| `make stop` | Para containers Docker |
| `make db-up` / `make db-down` | Sobe / para PostgreSQL |
| `make db-logs` | Logs do Postgres |
| `make db-reset` | **Apaga volume** do banco e recria container |
| `make migrate` | `prisma migrate dev` |
| `make generate` | `prisma generate` |
| `make prisma-studio` | Interface web do banco |
| `make mail-check` | Valida configuração de e-mail RF003 |
| `make secrets` | Gera `JWT_ACCESS_SECRET` aleatório |
| `make lint` | ESLint frontend + backend |
| `make test` | Testes unitários + e2e do backend |

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
- Para testes locais **sem depender de e-mail**, use `MAIL_PROVIDER=console` em `backend/.env` — o código aparece no **terminal da API**.
- A API sempre responde “e-mail enviado” mesmo se o endereço não estiver cadastrado (segurança).

---

## Solução de problemas

| Sintoma | O que verificar |
|---------|-----------------|
| Lista de pacientes carregando infinito | IP da API desatualizado — rode `make start` (sincroniza IP) ou `make sync-frontend-api-url`; celular na mesma Wi‑Fi que o PC |
| `ECONNREFUSED` / sem conexão | API rodando? `curl http://localhost:3000/health` |
| Código de senha não chega | Spam; e-mail cadastrado? `make mail-check`; ou `MAIL_PROVIDER=console` |
| Código inválido após reenvio | Usar código do **último** e-mail, não de tentativas anteriores |
| Erro de banco na API | `make db-up` e `make migrate` |
| Porta 5432 ocupada | Outro Postgres local ou container antigo — `make db-down` |

---

## Arquitetura (resumo)

| Camada | Pasta | Função |
|--------|-------|--------|
| **App mobile** | `frontend/` | Interface do fisioterapeuta |
| **API** | `backend/` | Regras, persistência, PDF, permissões |
| **PostgreSQL** | Docker / externo | Contas, pacientes, avaliações |

O servidor é a **fonte da verdade** clínica. Detalhes: [docs/engineering/architecture.md](docs/engineering/architecture.md).

---

## Documentação do produto

Índice completo: **[docs/README.md](docs/README.md)**

| Tema | Onde |
|------|------|
| Produto e RFs | [docs/product/](docs/product/) |
| API (comportamento) | [docs/backend/README.md](docs/backend/README.md) |
| App mobile | [docs/frontend/README.md](docs/frontend/README.md) |
| LGPD | [docs/product/privacy-and-lgpd.md](docs/product/privacy-and-lgpd.md) |
| Decisões (e-mail, domínio) | [docs/engineering/project-decisions.md](docs/engineering/project-decisions.md) |

Entrada para agentes automatizados: [AGENTS.md](AGENTS.md)

Especificação completa do produto: [docs/README.md](docs/README.md)
