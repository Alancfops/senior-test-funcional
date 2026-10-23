# Senior Teste Funcional — app mobile (Expo)
# make          → instala dependências do app
# make setup    → install + .env + setup da API (../stf-api)
# make start    → API (../stf-api) + Expo (sem npm install)
#
# A API NestJS + Postgres vive no repositório stf-api, clonado ao lado deste.

SHELL := /bin/bash
FRONTEND_DIR := frontend
API_DIR ?= ../stf-api

.DEFAULT_GOAL := install

.PHONY: help install setup env sync-frontend-api-url start start-backend start-frontend stop lint test

help:
	@echo "Senior Teste Funcional — alvos Make"
	@echo ""
	@echo "  make                 Instala dependências do app"
	@echo "  make setup           install + .env + setup da API ($(API_DIR))"
	@echo "  make start           API ($(API_DIR)) + Expo (sem instalar deps)"
	@echo "  make start-frontend  Apenas Expo (sincroniza IP LAN da API antes)"
	@echo "  make sync-frontend-api-url  Atualiza EXPO_PUBLIC_API_URL com IP LAN do PC"
	@echo "  make start-backend   Postgres + API NestJS ($(API_DIR))"
	@echo "  make lint            Lint do app"
	@echo "  make test            Testes do app"
	@echo "  make stop            Para o Postgres da API (processos locais: Ctrl+C)"
	@echo ""
	@echo "  Alvos de banco, migrations e testes da API: make -C $(API_DIR) help"

install:
	@echo ">> Instalando frontend..."
	@cd $(FRONTEND_DIR) && npm install

setup: install env
	@if [ -f "$(API_DIR)/Makefile" ]; then \
		$(MAKE) -C "$(API_DIR)" setup; \
	else \
		echo ">> API não encontrada em $(API_DIR) — clone git@github.com:Alancfops/stf-api.git ao lado deste repo."; \
	fi
	@echo ">> Setup concluído. Próximo passo: make start"

env:
	@if [ ! -f "$(FRONTEND_DIR)/.env" ] && [ -f "$(FRONTEND_DIR)/.env.example" ]; then \
		cp "$(FRONTEND_DIR)/.env.example" "$(FRONTEND_DIR)/.env"; \
		echo ">> Criado $(FRONTEND_DIR)/.env"; \
	fi

sync-frontend-api-url: env
	@bash scripts/sync-frontend-api-url.sh

start: env sync-frontend-api-url
	@set -euo pipefail; \
	trap 'kill 0' INT TERM; \
	if curl -sf -o /dev/null http://localhost:3000/health; then \
		echo ">> API já está rodando em http://localhost:3000 — reaproveitando (só Expo)."; \
	elif [ -f "$(API_DIR)/Makefile" ]; then \
		echo ">> Iniciando API ($(API_DIR), http://localhost:3000)..."; \
		$(MAKE) -C "$(API_DIR)" start & \
	else \
		echo ">> API não encontrada em $(API_DIR) — só Expo."; \
	fi; \
	echo ">> Iniciando frontend (Expo)..."; \
	(cd "$(FRONTEND_DIR)" && npm run start) & \
	wait

start-frontend: sync-frontend-api-url
	@cd $(FRONTEND_DIR) && npm run start

start-backend:
	@$(MAKE) -C "$(API_DIR)" start

stop:
	@if [ -f "$(API_DIR)/Makefile" ]; then $(MAKE) -C "$(API_DIR)" stop; fi
	@echo ">> Processos locais (Expo/API): use Ctrl+C no terminal do make start."

lint:
	@cd $(FRONTEND_DIR) && npm run lint

test:
	@cd $(FRONTEND_DIR) && npm run test
