# Exemplos — figma-to-frontend

## Exemplo 1 — Pedido com link

**Usuário:**
> Implementa a tela de login do Figma: https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional?node-id=2-1234

**Agente:**
1. Inventaria instâncias (`Button/Primary`, `Input/Default`, …).
2. Reutiliza ou cria em `src/components/ui/`; registra em reference.md.
3. Lê legenda “Esqueceu senha → Reset”; RF002; rota `app/(auth)/login.tsx`.
4. Implementa tela **compondo** components — sem estilo solto.
5. WCAG + handoff com tabela de components.

---

## Exemplo 2 — Frame sem node-id

**Usuário:**
> Faz a lista de pacientes conforme o Figma (frame “Home - Pacientes”).

**Agente:**
1. Pede link com `node-id` **ou** screenshot se não achar o frame.
2. Mapeia components do frame; reutiliza `SearchBar`, `PatientCard`, etc.
3. RF005 + `app/(main)/index.tsx`; busca, empty state, loading.
4. Atualiza tabelas em [reference.md](reference.md).

---

## Exemplo 3 — Divergência Figma × spec

**Figma:** botão “Ver resultado” visível durante blocos MEEM.  
**Spec RF010:** sem pontuação parcial.

**Agente:** implementa **sem** preview; documenta divergência no handoff; spec prevalece.

---

## Exemplo 4 — Tela clínica + LGPD

**Usuário:**
> Implementa cadastro de paciente (frame RF004).

**Agente:**
1. Components Figma para form + foto; registry atualizado.
2. RF004 + LGPD §3; revisão no handoff.
3. WCAG em todos os campos.

---

## Exemplo 5 — Ajuste visual (componente, não tela)

**Usuário:**
> O botão primário da lista está diferente do Figma.

**Agente:**
1. Abre master `Button/Primary` no Figma.
2. Corrige `components/ui/Button.tsx` — **não** override na tela da lista.
3. Handoff: componente alterado, telas afetadas.

---

## Exemplo 6 — Exceção: layout sem frame (aprovada)

**Usuário:**
> Pode fazer empty state de busca sem resultado; não tem frame no Figma.

**Agente:**
1. Confirma aprovação explícita (rule Figma).
2. Monta com `Text`, `Button/Primary`, tokens existentes — **sem** novo padrão visual.
3. Sugere adicionar frame no Figma depois.

---

## Exemplo 7 — Só tokens (Fase E)

**Usuário:**
> Ajusta cores da tela de feedback para bater com Figma; não muda API.

**Agente:**
1. Atualiza `theme/` a partir dos styles Figma.
2. Components consomem tokens — sem hex em telas.
3. Revalida WCAG.
