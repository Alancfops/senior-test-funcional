# Senior Teste Funcional — desenvolvimento local
# make          → instala dependências
# make setup    → install + .env + Postgres (Docker)
# make start    → install + .env + Postgres + API NestJS + Expo

SHELL := /bin/bash
BACKEND_DIR := backend
FRONTEND_DIR := frontend
COMPOSE := docker compose

.DEFAULT_GOAL := install

.PHONY: help install setup env secrets mail-check sync-frontend-api-url db-up db-down db-logs db-reset start start-backend start-frontend stop lint test migrate generate prisma-studio

help:
	@echo "Senior Teste Funcional — alvos Make"
	@echo ""
	@echo "  make                 Instala dependências (frontend + backend)"
	@echo "  make setup           install + arquivos .env + Postgres (Docker)"
	@echo "  make secrets         Gera JWT_ACCESS_SECRET aleatório (copie para backend/.env)"
	@echo "  make mail-check      Verifica configuração Resend no backend/.env"
	@echo "  make start           Instala deps, .env, Postgres, API (:3000) e Expo"
	@echo "  make start-frontend  Apenas Expo (sincroniza IP LAN da API antes)"
	@echo "  make sync-frontend-api-url  Atualiza EXPO_PUBLIC_API_URL com IP LAN do PC"
	@echo "  make start-backend   Postgres + API NestJS (watch)"
	@echo "  make db-up           Sobe PostgreSQL via Docker Compose"
	@echo "  make db-down         Para containers Docker"
	@echo "  make db-logs         Logs do Postgres"
	@echo "  make migrate         prisma migrate dev (backend/)"
	@echo "  make generate        prisma generate (backend/)"
	@echo "  make prisma-studio   Prisma Studio (backend/)"
	@echo "  make lint            Lint frontend (+ backend quando existir)"
	@echo "  make test            Testes frontend (+ backend quando existir)"
	@echo "  make stop            Para containers Docker (processos locais: Ctrl+C)"

install: install-frontend install-backend
	@echo ">> Dependências instaladas."

install-frontend:
	@echo ">> Instalando frontend..."
	@cd $(FRONTEND_DIR) && npm install

install-backend:
	@if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		echo ">> Instalando backend..."; \
		cd $(BACKEND_DIR) && npm install; \
	else \
		echo ">> backend/package.json ausente — pule por enquanto ou bootstrap NestJS em $(BACKEND_DIR)/"; \
	fi

setup: install env db-up
	@echo ">> Setup concluído. Próximo passo: make start"

secrets:
	@echo "JWT_ACCESS_SECRET=$$(openssl rand -base64 48 | tr -d '\n')"
	@echo "# Cole a linha acima em backend/.env (substitua o valor de dev)"

mail-check:
	@if [ ! -f "$(BACKEND_DIR)/.env" ]; then \
		echo ">> Crie backend/.env com: make setup"; \
		exit 1; \
	fi
	@. "$(BACKEND_DIR)/.env" 2>/dev/null; \
	provider=$${MAIL_PROVIDER:-gmail}; \
	if [ "$$provider" = "console" ]; then \
		echo ">> MAIL_PROVIDER=console — e-mails não saem; códigos no terminal da API."; \
	elif [ "$$provider" = "gmail" ]; then \
		if [ -z "$${GMAIL_USER:-}" ] || [ -z "$${GMAIL_APP_PASSWORD:-}" ] || [ "$${GMAIL_APP_PASSWORD}" = "cole_sua_senha_de_app_aqui" ]; then \
			echo ">> Configure GMAIL_USER e GMAIL_APP_PASSWORD em backend/.env"; \
			echo ">> Senha de app: https://myaccount.google.com/apppasswords"; \
			exit 1; \
		else \
			echo ">> Gmail SMTP OK — remetente: $${MAIL_FROM:-$$GMAIL_USER}"; \
		fi; \
	elif [ -z "$${RESEND_API_KEY:-}" ] || [ "$${RESEND_API_KEY}" = "re_cole_sua_chave_aqui" ]; then \
		echo ">> Configure RESEND_API_KEY em backend/.env (https://resend.com/api-keys)"; \
		exit 1; \
	else \
		echo ">> Resend OK — remetente: $${MAIL_FROM:-onboarding@resend.dev}"; \
	fi

env:
	@if [ ! -f "$(FRONTEND_DIR)/.env" ] && [ -f "$(FRONTEND_DIR)/.env.example" ]; then \
		cp "$(FRONTEND_DIR)/.env.example" "$(FRONTEND_DIR)/.env"; \
		echo ">> Criado $(FRONTEND_DIR)/.env"; \
	fi
	@if [ -f "$(BACKEND_DIR)/.env.example" ] && [ ! -f "$(BACKEND_DIR)/.env" ]; then \
		cp "$(BACKEND_DIR)/.env.example" "$(BACKEND_DIR)/.env"; \
		echo ">> Criado $(BACKEND_DIR)/.env"; \
	fi

sync-frontend-api-url: env
	@bash scripts/sync-frontend-api-url.sh

db-up:
	@if command -v docker >/dev/null 2>&1; then \
		echo ">> Subindo PostgreSQL (Docker)..."; \
		$(COMPOSE) up -d --wait postgres 2>/dev/null || $(COMPOSE) up -d postgres; \
	else \
		echo ">> Docker não encontrado — use Postgres local ou instale Docker para o backend."; \
	fi

db-down:
	@if command -v docker >/dev/null 2>&1; then \
		$(COMPOSE) down; \
	else \
		echo ">> Docker não encontrado."; \
	fi

db-logs:
	@$(COMPOSE) logs -f postgres

db-reset:
	@$(COMPOSE) down -v
	@$(COMPOSE) up -d --wait postgres 2>/dev/null || $(COMPOSE) up -d postgres

start: install env db-up sync-frontend-api-url
	@set -euo pipefail; \
	trap 'kill 0' INT TERM; \
	if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		echo ">> Iniciando backend (http://localhost:3000)..."; \
		(cd "$(BACKEND_DIR)" && npm run start:dev) & \
	else \
		echo ">> backend/ ainda sem package.json — só Expo (API virá na Fase B)."; \
	fi; \
	echo ">> Iniciando frontend (Expo)..."; \
	(cd "$(FRONTEND_DIR)" && npm run start) & \
	wait

start-frontend: sync-frontend-api-url
	@cd $(FRONTEND_DIR) && npm run start

start-backend: db-up
	@if [ ! -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "Erro: $(BACKEND_DIR)/package.json não encontrado."; \
		exit 1; \
	fi
	@cd $(BACKEND_DIR) && npm run start:dev

stop: db-down
	@echo ">> Containers Docker parados. Processos locais (Expo/API): use Ctrl+C no terminal do make start."

lint: lint-frontend lint-backend

lint-frontend:
	@cd $(FRONTEND_DIR) && npm run lint

lint-backend:
	@if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		cd $(BACKEND_DIR) && npm run lint; \
	else \
		echo ">> backend/ ausente — lint do backend ignorado."; \
	fi

test: test-frontend test-backend

test-frontend:
	@if npm run test --prefix $(FRONTEND_DIR) >/dev/null 2>&1; then \
		cd $(FRONTEND_DIR) && npm run test; \
	else \
		echo ">> frontend sem script test — ignorado."; \
	fi

test-backend:
	@if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		cd $(BACKEND_DIR) && npm run test; \
		cd $(BACKEND_DIR) && npm run test:e2e:prepare && npm run test:e2e; \
	else \
		echo ">> backend/ ausente — testes do backend ignorados."; \
	fi

migrate:
	@if [ ! -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "Erro: backend/ não encontrado."; \
		exit 1; \
	fi
	@cd $(BACKEND_DIR) && npx prisma migrate dev

generate:
	@if [ ! -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "Erro: backend/ não encontrado."; \
		exit 1; \
	fi
	@cd $(BACKEND_DIR) && npx prisma generate

prisma-studio:
	@if [ ! -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "Erro: backend/ não encontrado."; \
		exit 1; \
	fi
	@cd $(BACKEND_DIR) && npx prisma studio
