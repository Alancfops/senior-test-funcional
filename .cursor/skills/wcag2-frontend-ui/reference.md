# WCAG 2 — referência para React Native (nível AA)

Baseline: **WCAG 2.1 AA**. Incluir critérios **2.2** quando aplicável ao mobile. Critérios puramente web (ex.: bypass blocks 2.4.1 em página HTML) adaptam-se ao app: equivalente = navegação estruturada + rotas claras no Expo Router.

Legenda de colunas **RN**: props/padrões Expo/React Native.

---

## 1. Perceivable (Perceptível)

| Critério | Nível | Requisito resumido | RN / produto |
|----------|-------|-------------------|--------------|
| **1.1.1** Non-text Content | A | Alternativa textual para não-texto | `accessibilityLabel` em ícones, fotos paciente, gráficos (resumo) |
| **1.2.1** Audio-only and Video-only | A | Alternativa para mídia só áudio/vídeo | Se tutorial RF009 tiver vídeo: transcrição ou texto equivalente |
| **1.2.2** Captions | A | Legendas | Vídeos institucionais com legendas |
| **1.2.3** Audio Description or Media Alternative | A | Descrição ou alternativa | Tutorial multimídia com roteiro textual |
| **1.3.1** Info and Relationships | A | Estrutura programática | `accessibilityRole="header"`, listas, `radiogroup`, associação label–input |
| **1.3.2** Meaningful Sequence | A | Ordem de leitura lógica | Ordem de montagem = ordem visual; wizard instrumento→paciente→tutorial |
| **1.3.3** Sensory Characteristics | A | Não instruir só por forma/cor/posição | "Toque em **Salvar**" não "botão verde" |
| **1.3.4** Orientation (2.1) | AA | Portrait/landscape | App funciona em ambas quando rotation permitida |
| **1.3.5** Identify Input Purpose (2.1) | AA | Propósito de campos | `textContentType`, `autoComplete` em login/cadastro |
| **1.4.1** Use of Color | A | Cor não é único indicador | Katz, erros, gráficos: texto/ícone/padrão |
| **1.4.2** Audio Control | A | Controle de áudio automático | Sem som auto em loop na coleta |
| **1.4.3** Contrast (Minimum) | AA | 4,5:1 / 3:1 large | Validar tokens Fase D; ferramentas: contrast checker |
| **1.4.4** Resize Text | AA | 200% sem perda | `allowFontScaling`; testar Berg com fonte grande |
| **1.4.5** Images of Text | AA | Evitar texto em imagem | Preferir texto real; logo com alt |
| **1.4.10** Reflow (2.1) | AA | Sem scroll 2D em 320px equiv. | Telas estreitas; formulários responsivos |
| **1.4.11** Non-text Contrast (2.1) | AA | UI 3:1 | Bordas de input, ícones de ação, switches |
| **1.4.12** Text Spacing (2.1) | AA | Espaçamento ajustável | Não fixar altura que clipa texto escalado |
| **1.4.13** Content on Hover or Focus (2.1) | AA | Conteúdo adicional dismissível | Tooltips com fechar; evitar hover-only (web) |
| **1.4.2** (mobile) | — | — | Preferir componentes nativos de sistema quando possível |

---

## 2. Operable (Operável)

| Critério | Nível | Requisito resumido | RN / produto |
|----------|-------|-------------------|--------------|
| **2.1.1** Keyboard | A | Funcional via teclado | Teclado externo / switch control: foco em todos os controles |
| **2.1.2** No Keyboard Trap | A | Sem armadilha de foco | Modais liberam foco ao fechar |
| **2.1.4** Character Key Shortcuts (2.1) | A | Atalhos desligáveis/remapeáveis | Evitar atalho single-key global |
| **2.2.1** Timing Adjustable | A | Tempo ajustável | TUG: usuário controla início/fim; sessão JWT — mensagem antes de expirar |
| **2.2.2** Pause, Stop, Hide | A | Pausar movimento | Animações decorativas pausáveis |
| **2.3.1** Three Flashes | A | Sem flash >3/s | Evitar feedback visual piscante |
| **2.4.1** Bypass Blocks | A | Pular blocos repetidos | Skip to content → heading principal na tela |
| **2.4.2** Page Titled | A | Título descritivo | `Stack.Screen options={{ title }}` por rota |
| **2.4.3** Focus Order | A | Ordem de foco lógica | Wizard e formulários longos |
| **2.4.4** Link Purpose | A | Propósito do link claro | "Ver histórico de João" não "clique aqui" |
| **2.4.5** Multiple Ways | AA | Várias formas de achar | Home + busca pacientes |
| **2.4.6** Headings and Labels | AA | Títulos/labels descritivos | Instrumento + passo visível |
| **2.4.7** Focus Visible | AA | Foco visível | Estilo de foco em `Pressable` (Android ripple + outline) |
| **2.5.1** Pointer Gestures | A | Gesto complexo alternativo | Não exigir multiponto; drag opcional com botões |
| **2.5.2** Pointer Cancellation | A | Cancelar toque | `Pressable` onPressOut / cancelável |
| **2.5.3** Label in Name | A | Nome acessível contém label visível | Label visível ⊆ accessibilityLabel |
| **2.5.4** Motion Actuation | A | Movimento do dispositivo opcional | Sem shake-only actions |
| **2.5.5** Target Size (2.1) | AAA* | 44×44 CSS px | **Adotado como AA interno** — alvos toque |
| **2.5.6** Concurrent Input (2.2) | AAA | — | Opcional |
| **2.5.7** Dragging (2.2) | AA | Alternativa a drag | Reordenar com botões se houver drag |
| **2.5.8** Target Size Minimum (2.2) | AA | 24×24 com exceções | Preferir 44×44 neste produto |

\* Projeto exige 44×44 além do mínimo 2.5.8.

---

## 3. Understandable (Compreensível)

| Critério | Nível | Requisito resumido | RN / produto |
|----------|-------|-------------------|--------------|
| **3.1.1** Language of Page | A | Idioma da página | `lang` em web; app pt-BR consistente |
| **3.1.2** Language of Parts | AA | Idioma de trechos | Termos clínicos em latim com explicação se necessário |
| **3.2.1** On Focus | A | Foco não muda contexto sozinho | Foco em campo não submete form |
| **3.2.2** On Input | A | Input não muda contexto inesperado | Selecionar Katz não navega sem confirmação |
| **3.2.3** Consistent Navigation | AA | Nav consistente | Tab/stack patterns estáveis |
| **3.2.4** Consistent Identification | AA | Mesma função, mesmo nome | "Finalizar" sempre mesma ação |
| **3.2.5** Change on Request (3.2 AAA) | AAA | Mudanças só a pedido | Evitar redirect auto agressivo |
| **3.2.6** Consistent Help (2.2) | A | Ajuda consistente | Ícone ajuda no mesmo lugar em formulários |
| **3.3.1** Error Identification | A | Erros identificados | Mensagem + campo marcado |
| **3.3.2** Labels or Instructions | A | Labels/instruções | Tutorial RF009 + hints em campos |
| **3.3.3** Error Suggestion | AA | Sugestão de correção | "Preencha os 3 ensaios TUG" |
| **3.3.4** Error Prevention (Legal) | AA | Confirmação em ações críticas | Confirmar antes de descartar rascunho longo Berg |
| **3.3.7** Redundant Entry (2.2) | A | Não repetir dados | Reusar escolaridade cadastro MEEM |
| **3.3.8** Accessible Authentication (2.2) | AA | Auth sem teste cognitivo | Recuperação senha por e-mail/código, não puzzle |

---

## 4. Robust (Robusto)

| Critério | Nível | Requisito resumido | RN / produto |
|----------|-------|-------------------|--------------|
| **4.1.1** Parsing (2.0) | A | HTML válido | N/A RN nativo; válido em WebView PDF |
| **4.1.2** Name, Role, Value | A | Nome, papel, valor expostos | Props `accessibility*` completas |
| **4.1.3** Status Messages (2.1) | AA | Mensagens de status | `accessibilityLiveRegion="polite"` em toast/sucesso/erro |

---

## Snippets React Native

### Botão

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Finalizar avaliação Berg"
  accessibilityHint="Envia respostas para o servidor"
  accessibilityState={{ disabled: !isValid }}
  hitSlop={8}
  style={{ minHeight: 44, minWidth: 44 }}
  onPress={onFinalize}
>
  <Text>Finalizar</Text>
</Pressable>
```

### Grupo radio (Katz)

```tsx
<View accessibilityRole="radiogroup" accessibilityLabel="Banho — Katz">
  {options.map((opt) => (
    <Pressable
      key={opt.value}
      accessibilityRole="radio"
      accessibilityState={{ selected: value === opt.value }}
      accessibilityLabel={`${opt.label}, ${opt.description}`}
      onPress={() => setValue(opt.value)}
    />
  ))}
</View>
```

### Erro de formulário

```tsx
<Text
  accessibilityRole="alert"
  accessibilityLiveRegion="polite"
  nativeID={`${fieldId}-error`}
>
  Preencha o ensaio 2 do TUG.
</Text>
<TextInput accessibilityLabelledBy={`${fieldId}-label ${fieldId}-error`} />
```

### Reduce motion

```tsx
const [reduceMotion, setReduceMotion] = useState(false);
useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
  return () => sub.remove();
}, []);
// Usar reduceMotion para desligar animações não essenciais
```

---

## Testes manuais mínimos

| Teste | iOS | Android |
|-------|-----|---------|
| Percorrer tela só com leitor | VoiceOver | TalkBack |
| Ativar controle duplo-toque | ✓ | ✓ |
| Fonte máxima do SO | Ajustes → Display | Configuração → Fonte |
| Contraste | Simulador + ferramenta | Idem |
| Rotacionar (se suportado) | Sem perda de funcionalidade | Idem |

Ferramentas úteis: [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility_inspector) (Xcode), Android Accessibility Scanner, [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

---

## Relação com LGPD

Acessibilidade não substitui revisão LGPD ([lgpd-sensitive-data-review](../../../rules/lgpd-sensitive-data-review.mdc)). Labels de leitor de tela **não devem** expor dados clínicos além do necessário naquele contexto (ex.: evitar anunciar CPF completo em voz alta se não for essencial).
