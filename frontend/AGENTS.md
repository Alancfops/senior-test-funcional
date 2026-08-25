# Frontend — Guia para agentes

App **Expo SDK 54** + React Native do Sênior Teste Funcional. Entrada global do monorepo: [../AGENTS.md](../AGENTS.md).

## Documentação Expo

Leia a documentação **versionada** antes de escrever código: https://docs.expo.dev/versions/v54.0.0/

## Fontes canônicas

| Prioridade | Documento |
|------------|-----------|
| 1 | [Figma Senior Teste Funcional](https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Teste-Funcional?node-id=1-11490) — layout e fluxos visuais |
| 2 | [docs/frontend/README.md](../docs/frontend/README.md) · [figma-map.md](../docs/frontend/figma-map.md) |
| 3 | [docs/product/requirements.md](../docs/product/requirements.md) — RFs |

## Rules e skills obrigatórias

- [figma-screens-required](../.cursor/rules/figma-screens-required.mdc) — UI só conforme Figma
- Skill [figma-to-frontend](../.cursor/skills/figma-to-frontend/SKILL.md) — implementação de telas
- Skill [wcag2-frontend-ui](../.cursor/skills/wcag2-frontend-ui/SKILL.md) — acessibilidade WCAG 2 AA

## Subagent recomendado

[senior-test-frontend](../.cursor/agents/senior-test-frontend.md) — use ao implementar ou revisar telas, componentes ou integração API no app.

## Integração com a API

- `EXPO_PUBLIC_MOCK_AUTH=false` — auth e dados reais (Fase D)
- `EXPO_PUBLIC_API_URL` — sem barra final; `make start` sincroniza IP LAN para celular físico
- **Não** calcular score clínico, classificação ou PDF no cliente — consumir a API
