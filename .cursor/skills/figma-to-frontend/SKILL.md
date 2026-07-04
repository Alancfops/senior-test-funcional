---
name: figma-to-frontend
description: Implementa telas do Figma no app Expo/React Native do Senior Teste Funcional — lê frames, componentes e variantes do design system, legendas de fluxo, cruza com docs/ (RFs, backend, LGPD) e reutiliza biblioteca de componentes no código. Use ao implementar tela do Figma, ajustar UI, montar tela derivada com componentes existentes, handoff de design ou design-to-code.
---

# Figma → Frontend (Senior Teste Funcional)

Implementa **telas prontas do Figma** no cliente mobile (Expo / React Native), respeitando **requisitos em `docs/`** como fonte de comportamento e o Figma como fonte de **layout, componentes, variantes e copy** quando não conflitar com a spec.

**Design system:** antes de montar qualquer tela, identifique **Components** no arquivo Figma (botões, inputs, cards, headers, etc.) e espelhe em `frontend/src/components/`. Telas são **composição** de componentes — não estilos soltos por arquivo.

## Arquivo Figma oficial

| Campo | Valor |
|-------|--------|
| **Projeto** | Senior Teste Funcional |
| **URL base** | https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional |
| **File key** | `mtMbhRez2Xy2k414cfzcFm` |
| **Entrada sugerida (telas)** | [node `1:11490`](https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional?node-id=1-11490) |

Frames individuais: `?node-id=X-Y` na URL (API: `X:Y`).

## Quando invocar

- Usuário manda link do Figma, nome do frame ou pede “implementar esta tela”.
- Nova tela ou revisão visual sobre código existente em `frontend/`.

## Entradas do usuário (mínimo)

Peça o que faltar antes de codar:

1. **Link Figma** com `node-id` do frame **ou** screenshot anexo **ou** export PNG/SVG dos componentes.
2. **Nome do frame** e **legenda de fluxo** visível no Figma (setas, anotações, sticky notes).
3. **RF alvo** (ex.: RF005) se o usuário souber; senão infira pela legenda + [reference.md](reference.md).

Se o arquivo Figma não abrir (auth/MCP): peça screenshot + specs de Dev Mode (cores, fontes, spacing) — **não invente layout**.

---

## Fluxo obrigatório

```
Task Progress:
- [ ] 0. Inventariar Components/variants no Figma + mapear para `src/components/`
- [ ] 1. Abrir frame Figma + ler legenda de fluxo
- [ ] 2. Mapear frame → RF → rota Expo ([figma-map.md](../../../docs/frontend/figma-map.md); atualizar tabela de frames)
- [ ] 3. Ler docs (requirements, frontend, backend § endpoints)
- [ ] 4. LGPD se dado pessoal/sensível (rule lgpd-sensitive-data-review)
- [ ] 5. Implementar (comportamento → API → visual com componentes Figma)
- [ ] 6. WCAG AA (skill wcag2-frontend-ui)
- [ ] 7. Relatório de handoff (template abaixo)
```

### 0. Componentes Figma → código (obrigatório)

Antes da tela (e **de novo** se o frame usar componente ainda não mapeado):

1. **Localize no Figma** a página/seção de **Components** (ou instâncias `Component` / `Component set` dentro dos frames).
2. **Liste** o que o frame usa: ex. `Button/Primary`, `Input/Default`, `Card/Patient`, `Header/Screen`.
3. **Variantes e estados:** default, pressed, disabled, error, loading — espelhar via props (`variant`, `disabled`, `error`).
4. **No código:** preferir `frontend/src/components/ui/` (primitivos) e `frontend/src/components/` (compostos).
   - Componente Figma **já implementado** → **reutilizar**; não duplicar estilo inline.
   - Componente Figma **novo** → implementar **uma vez** a partir do master no Figma; registrar em [reference.md](reference.md) § Component registry.
5. **Tokens** vêm dos estilos ligados aos components (cores, texto, radius) → `frontend/src/theme/`; components consomem tokens, não hex solto.

**Ajuste em tela existente:** altere o **componente compartilhado** ou sua variante — não crie override local que diverge do design system.

**Tela ausente no Figma** (rule `figma-screens-required`): **pare** e avise o usuário. Se ele **aprovar exceção**, monte a tela **só** com componentes já existentes no Figma/código — **proibido** inventar novo padrão visual (botão, input, card) sem master no Figma.

### 1. Ler o Figma

- Localize o frame pedido; leia **título**, **legendas de fluxo** (próxima tela, condições, erros).
- Extraia: textos (microcopy), hierarquia, **instâncias de componentes** (nome no painel Layers), estados (vazio, erro, loading) se existirem no arquivo.
- Identifique **design tokens** (cor, tipografia, radius, spacing) — na 1ª tela, crie/atualize `frontend/src/theme/`; nas seguintes, **reutilize tokens**.
- Anote divergências entre Figma e `docs/product/requirements.md` **antes** de codar; spec de produto prevalece salvo pedido explícito do usuário.

### 2. Cruzar com `docs/`

| Prioridade | Documento | Para quê |
|------------|-----------|----------|
| 1 | [docs/product/requirements.md](../../../docs/product/requirements.md) | RFs, campos, regras, bloqueios |
| 2 | [docs/frontend/README.md](../../../docs/frontend/README.md) | Fluxos §5, instrumentos §6, anti-padrões §11, rotas §10 |
| 3 | [docs/backend/README.md](../../../docs/backend/README.md) | Endpoints, finalize, timeseries, PDF |
| 4 | [docs/product/privacy-and-lgpd.md](../../../docs/product/privacy-and-lgpd.md) | Telas com paciente/avaliação |
| 5 | [docs/clinical-protocols/instruments/](../../../docs/clinical-protocols/instruments/) | RF010 por instrumento |
| 6 | [docs/engineering/repository-and-workflow.md](../../../docs/engineering/repository-and-workflow.md) | Fase C–E (comportamento antes de polish puro) |

Mapeamento RF ↔ rota ↔ frame: [figma-map.md](../../../docs/frontend/figma-map.md). Atualize a tabela de frames lá quando confirmar nome no Figma.

### 3. Implementação (ordem)

1. **Componentes** — garantir primitivos Figma em `src/components/`; compor tela.
2. **Rota e navegação** — Expo Router conforme [docs/frontend/README.md](../../../docs/frontend/README.md) §10.
3. **Comportamento e dados** — TanStack Query, RHF + Zod, wizard Zustand; **API real**, sem mock de classificação.
4. **Estados UX** — loading, vazio, erro rede, 401 ([frontend README §5.2](../../../docs/frontend/README.md)).
5. **Visual** — layout do frame usando **somente** componentes mapeados + tokens.
6. **Acessibilidade** — aplicar skill **`wcag2-frontend-ui`**; relatório WCAG na entrega.
7. **LGPD** — se cadastro paciente, avaliação, foto, PDF: declarar revisão conforme rule **`lgpd-sensitive-data-review`**.

### 4. Regras de ouro (não negociáveis)

| Figma / UX | Spec / arquitetura |
|------------|-------------------|
| Layout e identidade | Comportamento vem dos RFs |
| Botão “Finalizar” bonito | Só habilita quando válido; chama **finalize** na API |
| Preview de score MEEM/Katz | **Proibido** antes do fim (RF010/RF011) |
| Gráfico decorativo | Só se API tiver ≥2 pontos (RF012) |
| PDF montado no app | **Proibido** — blob do servidor (RF013) |
| Lista sem busca | RF005 exige pesquisa |
| Pixel-perfect que quebra fonte do SO ou AA | Adaptar mantendo WCAG |
| Estilo novo inline na tela | **Usar componente Figma** já mapeado ou criar master no Figma primeiro |
| Tela excepcional sem frame | **Só** composição de components existentes (rule Figma) |

Stack: Expo, React Native, TypeScript, Expo Router, TanStack Query, Zustand (wizard), RHF + Zod, expo-secure-store — ver [frontend README §3](../../../docs/frontend/README.md).

---

## Relatório de handoff (entregar ao usuário)

```markdown
## Handoff Figma → código — [nome do frame]

**Figma:** [link com node-id]
**RF(s):** RF00X …
**Rota:** `frontend/app/...`
**Arquivos criados/alterados:** …

### Componentes Figma utilizados
| Componente Figma | Código | Novo/reutilizado |
|------------------|--------|------------------|
| Button/Primary | `src/components/ui/Button.tsx` | reutilizado |
| … | … | … |

### Legenda de fluxo (Figma)
- …

### Conformidade docs
| Item | Status | Nota |
|------|--------|------|
| Campos/regras RF | OK / gap | … |
| API integrada | OK / pendente | endpoints … |
| Estados loading/erro/vazio | OK / gap | … |
| LGPD | N/A / revisado | … |
| WCAG AA | Pass / pendências | … |

### Divergências Figma × spec
- … (spec prevaleceu / usuário decidiu …)

### Pendências
- …
```

---

## Pedido típico do usuário

> “Implementa o frame **Login** do Figma: [link node-id=…]”

Resposta esperada: executar fluxo §1–7, código em `frontend/`, handoff + WCAG resumido.

---

## Recursos

- Mapeamento RF, rotas, **component registry**: [reference.md](reference.md)
- WCAG: `.cursor/skills/wcag2-frontend-ui/`
- LGPD: `.cursor/rules/lgpd-sensitive-data-review.mdc`
- Exemplos de pedidos: [examples.md](examples.md)
