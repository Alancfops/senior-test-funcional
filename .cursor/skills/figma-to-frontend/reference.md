# Referência — Figma Senior Teste Funcional

## Arquivo

```
Nome:    Senior Teste Funcional
URL:     https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional
File key: mtMbhRez2Xy2k414cfzcFm
Seção telas (entrada): node-id=1-11490  →  node 1:11490
```

**Como abrir um frame específico:** copie o `node-id` do Figma (barra de endereço ao selecionar o frame) e monte:

`https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional?node-id=NODE`

**Legendas de fluxo:** no arquivo, frames costumam trazer anotações (setas, “→ Login”, “401 → sessão expirada”). Trate a legenda como **mapa de navegação**; valide contra [figma-map.md](../../../docs/frontend/figma-map.md) e [frontend README §5.1](../../../docs/frontend/README.md).

**Sem acesso ao Figma:** solicite ao usuário screenshot do frame + painel Inspect (cor, fonte, padding), **lista de components usados** ou export dos assets.

---

## Biblioteca de Components (Figma → código)

### Onde achar no Figma

1. Página **Components**, **Design System**, **UI Kit** ou equivalente no arquivo.
2. Dentro do frame: instâncias com ícone ◆ (component) no Layers — anote o **nome do master** (ex. `Button/Primary`).
3. **Component sets** (variantes): propriedade `Variant` ou `State` no painel direito — mapear para props React.

### Fluxo de mapeamento

```
Figma master → implementar 1× em src/components/ui/
Instância na tela → import + props (variant, size, disabled, error)
Novo uso do mesmo master → só composição, zero CSS duplicado
```

### Estrutura de pastas sugerida

```
frontend/src/
├── theme/           # tokens extraídos dos styles Figma
├── components/
│   ├── ui/          # primitivos 1:1 com Figma (Button, TextInput, …)
│   └── …            # compostos (PatientCard, ScreenHeader, …)
```

### Component registry (atualizar ao implementar)

| Componente Figma | Variantes / estados | Arquivo RN | Notas |
|------------------|---------------------|------------|-------|
| *(ex. Button)* | Primary, Secondary, Disabled | `components/ui/Button.tsx` | `variant`, `disabled` |
| *(ex. Input)* | Default, Error, Focus | `components/ui/TextInput.tsx` | `error`, `accessibilityLabel` |
| | | | |

**Instrução ao agente:** ao criar ou descobrir componente no Figma, **adicione linha** nesta tabela.

### Regras de reutilização

| Situação | Ação |
|----------|------|
| Tela nova com frame Figma | Compor com components registry; criar só o que faltar no Figma |
| Ajuste visual pedido pelo usuário | Alterar **componente base** ou variante — propaga para todas as telas |
| Tela **sem** frame (exceção aprovada) | Layout novo **apenas** com components já no Figma; avisar se faltar master |
| Componente na tela não existe no Figma | **Parar** — pedir ao usuário criar no Figma ou confirmar qual master usar |
| Ícone / ilustração | Export SVG/PNG do Figma ou `expo-image`; não substituir por ícone genérico diferente |

### Props ↔ variantes Figma

| Figma | Código |
|-------|--------|
| Variant = Primary | `variant="primary"` |
| State = Disabled | `disabled` ou `accessibilityState={{ disabled: true }}` |
| State = Error | `error` + mensagem RF |
| Size = Large | `size="lg"` + `minHeight: 44` (WCAG) |

---

## Mapa RF → rota → frame Figma (canônico)

**Fonte única:** [docs/frontend/figma-map.md](../../../docs/frontend/figma-map.md) — tabela RF ↔ rota, diagrama de fluxo e **tabela Frame Figma** (preencher na implementação).

Ao implementar um frame: atualize a tabela em `figma-map.md` **e** mantenha o component registry abaixo neste arquivo.

**Ordem de entrega:** backend do RF (OpenAPI) → UI Figma — [repository-and-workflow §2.1](../../../docs/engineering/repository-and-workflow.md).

---

## Extração de design tokens (1ª tela ou página Styles no Figma)

Criar/atualizar em `frontend/src/theme/` (nomes sugeridos):

| Token | Uso |
|-------|-----|
| `colors.primary`, `background`, `surface`, `error`, `text`, `textMuted` | botões, fundos, erros |
| `typography.heading`, `body`, `caption`, `label` | escala alinhada ao Figma |
| `spacing.xs` … `xl` | padding/margin (4/8/12/16/24…) |
| `radius.sm`, `md`, `lg` | cards, inputs |
| `touchTargetMin` | 44 (WCAG + skill wcag2) |

Preferir tokens + **components/ui/**; não hardcodar hex em telas.

---

## Componentes compostos (referência — derivam dos primitivos Figma)

| Composto RN | Montado a partir de |
|-------------|---------------------|
| `PatientCard` | Card + Text + Avatar (masters Figma) |
| `EmptyState` | Text + Button/Primary |
| `ErrorState` | Text + Button/Secondary |
| `LoadingSkeleton` | Surface + animação reduce-motion |
| `InstrumentCard` | Card + Text + ícone exportado |
| `ProgressStep` | Text caption + barra (tokens spacing) |
| `RadioGroup` | Pressable + radio variant Figma |
| `ScreenHeader`, `SafeScroll` | Header master + layout tokens |

Se o Figma tiver composite nomeado (ex. `Card/Patient`), preferir **mesmo nome** no código.

---

## API — lembrar ao implementar

Consultar [docs/backend/README.md](../../../docs/backend/README.md) §4:

- Auth: register, login, forgot-password  
- Patients: CRUD + list com busca  
- Assessments: create draft, patch payload, **finalize**  
- Timeseries: gráfico RF012  
- Report PDF: RF013  

Cliente: `Authorization: Bearer`, `EXPO_PUBLIC_API_URL`, invalidar queries após mutação ([frontend §9](../../../docs/frontend/README.md)).

---

## Checklist por tipo de tela

### Auth (RF001–RF003)
- [ ] Validação Zod igual política RF (senha, e-mail)
- [ ] Erros legíveis; sem revelar qual campo falhou se política RF002
- [ ] Links: registro ↔ login ↔ esqueci senha

### Lista pacientes (RF005)
- [ ] Busca funcional
- [ ] Empty + CTA cadastro
- [ ] Pull-to-refresh opcional

### Wizard avaliação (RF007–RF011)
- [ ] Ordem instrumento → paciente (spec); wizard state limpo após finalize
- [ ] MEEM: escolaridade confirmável
- [ ] Feedback só pós-API

### Perfil (RF006)
- [ ] Histórico por instrumento
- [ ] Atalho novo teste

---

## Integração com outras skills/rules

| Situação | Acionar |
|----------|---------|
| Qualquer UI entregue | `wcag2-frontend-ui` + relatório WCAG |
| Paciente, avaliação, foto, PDF, logs | rule `lgpd-sensitive-data-review` |
| Salvar progresso da sessão de trabalho | `save-session` (pedido do usuário) |
