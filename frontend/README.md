# Frontend — Sênior Teste Funcional (React Native)

Aplicativo cliente em **React Native (Expo)**, segundo [arquitetura.md](../docs/engenharia/arquitetura.md).

## Fase atual do produto no plano oficial

Este diretório deverá conter inicialmente telas **de rascunho / placeholder** apenas para **consumir endpoints reais** do `../backend/` e garantir fluxo RF até feedback/PDF funcionais ponta-a-ponto.

Depois haverá **implementação UI definitiva** feita com materiais vindos da **equipe de design** (tokens, grids, biblioteca).

## Como documentar dentro desta pasta (quando o código existir)

```
frontend/
├── README.md          # Você está aqui
├── app ou src/       # Fluxo expo-router ou RN clássico (a criar)
└── docs/
    └── design-handoff.md  # Links Figma ou assets quando disponíveis
```

## Contrato com Backend

Versão atual da API será referenciada no backend (Swagger/OpenAPI). O front **não inventa mocks** quando API existe — apenas fallback controlado opcional modo dev.

## Fluxo esperado até UI final

Consulte **[docs/engenharia/repositorio-e-fluxo-desenvolvimento.md](../docs/engenharia/repositorio-e-fluxo-desenvolvimento.md)** (Fases **C**, **D**, **E**).

### Quando o código existir (Bun workspaces)

Projeto criado conforme Expo + Bun (`bun install` na raiz do monorepo). Subir apenas o cliente: exemplo típico `bun run --filter frontend start` (ajuste ao `name` do `package.json` do app). Documentação oficial: [Using Bun](https://docs.expo.dev/guides/using-bun/).
