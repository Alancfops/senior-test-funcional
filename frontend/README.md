# Frontend — Sênior Teste Funcional (React Native)

Aplicativo cliente em **React Native (Expo)**, segundo [arquitetura.md](../docs/engenharia/arquitetura.md).

O diretório concentra inicialmente uma **implementação orientada primeiro aos requisitos e aos fluxos de negócio oficiais**: consumir API homologável, validar todas as navegações descritas na PRD até feedback e exportações relacionadas e, só então consolidar camada cosmética alinhada aos **tokens** de identidade institucional quando definidos.

Dados tratados pela aplicação e obrigações legais brasileiras: [privacidade-e-lgpd.md](../docs/produto/privacidade-e-lgpd.md).

## Estrutura sugerida (quando o scaffold existir)

```
frontend/
├── README.md               # Você está aqui
├── app ou src/
└── documentação própria     # exemplo: referência rápida a tema/tokens externos
```

## Integração com a API do servidor

Versão vigente das rotas públicas é definida pela pasta **`backend/`** e documentada pela OpenAPI. Durante desenvolvimento integrado, preferir apenas respostas reais já implementadas; usar mocks apenas em cenários **explicitamente delimitados** e **marcados**.

## Cronograma (fases C–E)

**[docs/engenharia/repositorio-e-fluxo-desenvolvimento.md](../docs/engenharia/repositorio-e-fluxo-desenvolvimento.md)** — as fases **C**–**E** referem‑se predominantemente ao trabalho desta pasta, **após** as fases iniciais concluídas no servidor (A–B).

Da raiz (`bun install`), subir apenas o cliente conforme scripts futuros declarados (`bun run --filter …`). Documentação oficial Expo + Bun: [Using Bun](https://docs.expo.dev/guides/using-bun/).
