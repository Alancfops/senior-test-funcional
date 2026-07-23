# Frontend — Sênior Teste Funcional

App **Expo + React Native + Expo Router** do projeto Sênior Teste Funcional.

## Início rápido

Na **raiz do monorepo** (recomendado):

```bash
make setup      # primeira vez: deps, .env, Postgres
make migrate    # migrations (backend)
make start      # instala deps + Postgres + API + Expo
```

Só o Expo:

```bash
make start-frontend
```

## Configuração

Arquivo `frontend/.env` (criado por `make setup`):

| Variável | Uso |
|----------|-----|
| `EXPO_PUBLIC_API_URL` | URL da API — `http://localhost:3000` (web/emulador) ou `http://SEU_IP:3000` (celular) |
| `EXPO_PUBLIC_MOCK_AUTH` | `false` = API real (padrão em `.env.example`) |

Após alterar `.env`, reinicie o Expo.

## Scripts npm (nesta pasta)

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Expo dev server |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Checagem TypeScript |

## Documentação

| Tema | Onde |
|------|------|
| Arquitetura e fluxos do app | [docs/frontend/README.md](../docs/frontend/README.md) |
| Mapa Figma ↔ rotas ↔ RFs | [docs/frontend/figma-map.md](../docs/frontend/figma-map.md) |
| Instalação completa + Makefile | [README.md](../README.md) na raiz |
| Figma oficial | [Senior Teste Funcional](https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional?node-id=1-11490) |
