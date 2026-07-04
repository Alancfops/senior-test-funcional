---
name: wcag2-frontend-ui
description: Aplica WCAG 2 (nível AA) em UI/UX do app mobile Expo/React Native — contraste, alvos de toque, leitor de tela, formulários, gráficos e estados. Use ao implementar ou revisar telas, componentes, fluxos, design tokens, copy de interface, docs/frontend ou quando o usuário mencionar WCAG, acessibilidade, a11y ou UX do frontend.
---

# WCAG 2 — Frontend UI/UX

Todo trabalho de **interface do app** (Expo / React Native) deve cumprir **WCAG 2.1 nível AA** como baseline; critérios **2.2** aplicam quando couber. Não trate acessibilidade como fase opcional — entra desde a **Fase C** ([docs/frontend/README.md](../../../docs/frontend/README.md)).

**Contexto do produto:** fisioterapeuta em pé, formulários longos (Berg 14, Tinetti 16, MEEM), cronômetro TUG, gráficos e PDF. Público indireto inclui **idosos** — legibilidade e alvos amplos são requisito, não nice-to-have.

## Antes de implementar ou revisar UI

1. Leia [docs/frontend/README.md](../../../docs/frontend/README.md) §5–§6 (fluxos e instrumentos).
2. Identifique **tipo de tela**: auth, lista, wizard, formulário clínico, gráfico, feedback, PDF.
3. Abra [reference.md](reference.md) na seção do princípio POUR correspondente.
4. Ao concluir, preencha o **Relatório WCAG** (template abaixo) na resposta ao usuário ou no PR.

## Nível alvo

| Nível | Uso neste projeto |
|-------|-------------------|
| **A** | Mínimo legal — insuficiente sozinho |
| **AA** | **Obrigatório** em toda área do front |
| **AAA** | Desejável pontual (ex.: contraste 7:1 em textos críticos MEEM); não bloqueie entrega AA |

Referência normativa: [WCAG 2.1](https://www.w3.org/TR/WCAG21/) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [Understanding WCAG](https://www.w3.org/WAI/WCAG21/Understanding/).

## React Native / Expo — padrões obrigatórios

| Área | Implementação |
|------|----------------|
| Nome acessível | `accessibilityLabel` em todo controle interativo e ícone com função |
| Papel | `accessibilityRole` (`button`, `link`, `header`, `radio`, `checkbox`, `progressbar`, …) |
| Dica | `accessibilityHint` quando o label sozinho não explica consequência |
| Estado | `accessibilityState={{ disabled, selected, checked, busy }}` |
| Agrupamento | `accessible={true}` no container; filhos `importantForAccessibility="no-hide-descendants"` quando redundante |
| Foco / ordem | Ordem de leitura = ordem visual lógica; não depender só de posição absoluta |
| Toque | Mínimo **44×44 dp/pt** por alvo (WCAG 2.5.5 / 2.5.8); espaçamento entre radios Katz |
| Contraste | Texto normal **4,5:1**; texto grande (≥18pt ou 14pt negrito) **3:1**; UI/componentes **3:1** |
| Cor | Nunca só cor para estado (Katz I/A/D, erros, gráfico) — ícone + texto + padrão |
| Movimento | Respeitar `AccessibilityInfo.isReduceMotionEnabled()`; animações não essenciais desligáveis |
| Zoom / fonte | Suportar escala do sistema (`allowFontScaling`, `maxFontSizeMultiplier` ≥ 1,5 sem quebrar layout) |
| Formulários | Label visível + acessível; erro ligado ao campo (`accessibilityLiveRegion` / anúncio) |
| Gráficos RF012 | Resumo textual da tendência; não só curva colorida |
| Imagens | `accessibilityLabel` descritivo; decorativas `accessible={false}` |
| Modais / sheets | Foco preso no modal; fechar com gesto **e** controle acessível |

Preferir componentes base (`Button`, `TextInput`, `RadioGroup`) já acessíveis em `src/components/` — não duplicar props em cada tela.

## Checklist por entrega de tela

Copie e marque antes de considerar a UI pronta:

```
WCAG — [nome da tela/feature]
- [ ] Perceivable: contraste AA; texto alternativo; não só cor; legendas em gráficos
- [ ] Operable: alvos ≥44dp; gestos alternativos; sem armadilha de foco; tempo suficiente (TUG)
- [ ] Understandable: labels claros; erros identificados + sugestão; linguagem pt-BR consistente
- [ ] Robust: roles/labels testados VoiceOver (iOS) e TalkBack (Android)
- [ ] Instrumento clínico: progresso anunciado (ex. "Item 7 de 14, Berg")
- [ ] Estados loading/erro/vazio (§5.2 frontend README) acessíveis
```

## Fluxos críticos do produto

| Fluxo | WCAG em destaque |
|-------|------------------|
| Login / registro / reset | Autocomplete semântico, erro de credencial claro, não só borda vermelha |
| Lista pacientes RF005 | Busca acessível, empty state com CTA, pull-to-refresh anunciado |
| Wizard avaliação | Ordem de foco estável entre passos; botão Voltar sempre alcançável |
| Berg / Tinetti | Scroll + foco; valor selecionado anunciado; indicador "X de N" |
| Katz radios | Grupo com `accessibilityRole="radiogroup"`; cada opção I/A/D nomeada |
| TUG cronômetro | Tempo anunciado ao iniciar/parar; não depender só de dígitos pequenos |
| MEEM | Sem vazar pontuação parcial (RF); blocos com cabeçalho `header` |
| Feedback RF011 | Resultado clínico em texto legível + contraste; classificação não só cor |
| Gráfico RF012 | Tabela ou lista alternativa dos pontos; legenda de melhora/piora em texto |
| PDF RF013 | Ação "visualizar/compartilhar" com label claro |

## Relatório WCAG (obrigatório ao entregar UI)

```markdown
## Revisão WCAG 2 — [tela/componente]

**Escopo:** …
**Nível:** AA
**Dispositivos considerados:** iOS VoiceOver · Android TalkBack

### Conformidade
| Critério | Status | Notas |
|----------|--------|-------|
| 1.4.3 Contraste | Pass/Fail | … |
| 2.5.5 Alvo toque | Pass/Fail | … |
| … | … | … |

### Pendências
- …

### Testes manuais
- [ ] VoiceOver percorreu fluxo completo
- [ ] TalkBack percorreu fluxo completo
- [ ] Escala de fonte 200% sem perda de conteúdo
```

Critérios completos e mapeamento RN: [reference.md](reference.md).

## O que não fazer

- Deixar `TouchableOpacity` / `Pressable` sem `accessibilityLabel`
- Usar placeholder como único label
- Bloquear zoom do sistema sem alternativa
- Gráfico sem descrição textual
- Animação contínua sem respeitar reduce motion
- Marcar UI como pronta sem checklist + relatório

## Recursos

- Checklist detalhado WCAG 2.1/2.2: [reference.md](reference.md)
- Produto e fluxos: [docs/frontend/README.md](../../../docs/frontend/README.md)
- Fases visuais: [docs/engineering/repository-and-workflow.md](../../../docs/engineering/repository-and-workflow.md) §2–§3
