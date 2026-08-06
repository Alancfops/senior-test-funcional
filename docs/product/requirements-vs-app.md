# Diferenças — levantamento de requisitos × app implementado

**Data:** 2026-08-06  
**Escopo:** comparar [requirements.md](./requirements.md) (e, quando útil, [PRD.md](./PRD.md)) com o **estado atual do código** em `frontend/` + `backend/` na branch `develop`.  
**Uso:** apoio para **atualizar o documento de requisitos** adaptando-o ao app (e ao Figma), não o contrário.

**Referências de implementação:** [figma-map.md](../frontend/figma-map.md) · [project-decisions.md](../engineering/project-decisions.md)

---

## Como ler esta lista

| Símbolo | Significado |
|---------|-------------|
| **Doc → App** | O levantamento descreve algo que o app **não faz** (ou faz de outro jeito). Candidato a **reescrever o RF** para espelhar o produto. |
| **App → Doc** | O app / API tem comportamento **além** do texto do RF (ou decisão registrada fora do requirements). Candidato a **incluir no documento**. |
| **Alinhado** | Spec e implementação batem no essencial. |

---

## Visão geral

O núcleo do MVP (**RF001–RF013**) está implementado: auth, pacientes, fluxo de avaliação dos cinco instrumentos, scoring no servidor, histórico, gráfico e PDF. As diferenças abaixo são sobretudo de **forma de UX mobile/Figma**, **obrigatoriedade de campos** e **detalhes de apresentação** — não de ausência de módulo inteiro.

---

## Por requisito funcional

### RF001 — Cadastro do fisioterapeuta

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Campos e política de senha | Nome, e-mail, senha + confirmação; regras de complexidade | Implementado (Zod front/back) | **Alinhado** |
| Hash de senha | Criptografada | Argon2id no servidor | **Alinhado** |

### RF002 — Login

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Login + erro genérico + home | Sim | Sim | **Alinhado** |
| Link “Esqueceu a senha?” | Sim | Sim | **Alinhado** |

### RF003 — Recuperação de senha

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Token 6 dígitos, TTL 10 min, uso único | Sim | Sim | **Alinhado** |
| Canal de e-mail | Implícito (provedor) | Gmail SMTP dedicado ao TCC; **sem domínio** próprio | **App → Doc** — ver [project-decisions.md](../engineering/project-decisions.md) (2026-07-21) |

### RF004 — Cadastro de pacientes

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Nome, idade, sexo, foto opcional | Conforme tabela | Conforme | **Alinhado** |
| Contato | E-mail **ou** telefone | UI coleta **só telefone** (máscara BR). API ainda aceita e-mail **ou** telefone no campo `contact` | **Doc → App** — adaptar RF para “telefone celular” **ou** voltar a aceitar e-mail na UI |
| Escolaridade | **Recomendada**; MEEM exige se em branco | Cadastro exige escolaridade (**obrigatória**) no front e no Zod de create. Coluna no banco continua nullable | **Doc → App** — principal divergência de produto; sessão 2026-07-21 documentou a obrigatoriedade |
| Confirmação/ajuste de escolaridade na abertura do MEEM | Spec prevê confirmar/ajustar na sessão | App usa valor do cadastro na sessão; finalize MEEM exige `schoolingBandUsed` no servidor | Parcialmente alinhado; UI de “ajuste pontual na sessão” é mais simples que o texto do RF |

### RF005 — Listagem e pesquisa de pacientes

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Só pacientes do fisio logado | Sim | Sim (`therapist_id`) | **Alinhado** |
| Busca por nome | Tempo real | SearchBar + query | **Alinhado** |
| Resultados por página 10 / 25 / 50 | Obrigatório no RF | UI **sem** seletor; lista envia `limit` fixo (ex.: 50). API aceita `limit` 1–50 (default 25) | **Doc → App** — descrever lista com limite fixo / scroll mobile |
| Ordenação | Tocar nos **cabeçalhos** Nome / Idade / Sexo | Sheet de **filtros** (nome, idade, sexo + ordem) — sem tabela com cabeçalhos | **Doc → App** — refletir Figma / mobile |
| Mensagem vazia | “Nenhum registro encontrado” | Com busca/filtro: essa mensagem; lista vazia sem filtro: “Nenhum paciente cadastrado” | Quase alinhado; nuance de copy |
| Sem ID interno na lista | Observação de produto | Não exibe ID | **Alinhado** |

### RF006 — Perfil e histórico do paciente

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Dados, histórico recente→antiga, detalhe | Sim | Sim | **Alinhado** |
| Gráfico só com ≥ 2 do mesmo instrumento | Sim | Sim (timeseries `canShowChart`) | **Alinhado** |
| “Nova avaliação” → listagem de instrumentos | Encaminha a RF007 | Navega para tela **Aplicar Teste** (instrumento + paciente juntos) | Ver RF007/RF008 |

### RF007 / RF008 — Instrumento e paciente

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Fluxo em **duas** etapas (instrumento → paciente) | RF007 depois RF008 | **Uma** tela Figma “Aplicar Teste” (`apply.tsx`) com os dois selects | **Doc → App** — unificar no texto como no Figma |
| Lista com **autores** obrigatórios | Nome + autor(es); ordem **alfabética** | App usa catálogo **local** (nome sem autores na label; ordem do array). API `GET /instruments` já devolve autores e ordena por `displayName` | **Doc → App** se mantiver UI atual; ou **App → Doc** se passar a consumir a API |
| Mensagens de vazio | “Nenhum instrumento encontrado” / “Nenhum registro encontrado” | SearchSelect: “Nenhum resultado encontrado.” (genérico) | Detalhe de copy |
| Tutorial obrigatório antes da coleta | Sim | Sim | **Alinhado** |

### RF009 — Tutorial

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Conteúdo dinâmico, próximo/anterior, voltar | Sim | Dois passos + textos por instrumento | **Alinhado** no essencial |
| Guia visual / comandos verbais detalhados | Spec rica | Conteúdo em `instruments.ts` (texto); imagens sobretudo no TUG | Pode detalhar no doc o que existe de fato |

### RF010 — Execução

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| TUG 3 tempos + média; Katz I/A/D estrato D; Berg; Tinetti; MEEM | Regras de cálculo | Scoring **oficial no servidor** no finalize | **Alinhado** |
| Progresso / finalizar só com campos válidos | Sim | Sim | **Alinhado** |
| MEEM sem pontuação parcial durante a aplicação | Sim | Coleta sem total interpretativo na UI | **Alinhado** |
| Tinetti “Item X de 16” | Preferência de copy | Progresso numérico tipo `01/16` | Equivalente funcional |

### RF011 — Feedback imediato

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Resultado bruto + classificação | Sim | Tela resultado após finalize | **Alinhado** |
| Comparativo melhor / igual / pior (opcional) | Previsto | API devolve `delta`; **UI não exibe** | **Doc → App** — marcar como não implementado na UI **ou** remover do RF |
| Atalho “Gerar relatório PDF” | No feedback | PDF no **detalhe** da avaliação no perfil (`patients/[id]/assessment/...`), não na tela de resultado imediato | **Doc → App** — descrever onde o atalho existe de fato |
| “Ver evolução” | Leva ao histórico | Gráfico **embutido** na própria tela de resultado (quando ≥ 2) | **Doc → App** |

### RF012 — Gráfico evolutivo

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| Eixos, legendas melhora, ≥ 2 pontos | Sim | Implementado (app + PDF) | **Alinhado** |
| Mensagem com uma só aplicação | Sim | Mensagem de “realize mais avaliações…” | **Alinhado** |

### RF013 — Relatório PDF

| Tema | Documento | App / API | Notas |
|------|-----------|-----------|--------|
| PDF A4 no servidor; fisio + paciente; assinatura/carimbo | Sim | Módulo `reports/` | **Alinhado** |
| Escolaridade no PDF | Relevante no MEEM (valor da sessão) | Só MEEM no relatório | **Alinhado** |
| CREFITO no cabeçalho | Não exigido no RF | Opcional / ausente na API atual | **App → Doc** se quiser registrar omissão |

---

## Fora dos RFs numerados (mas relevantes ao “projeto app”)

| Tema | Documento | Realidade do projeto |
|------|-----------|------------------------|
| Canal web | Fora do núcleo MVP | Só app mobile (Expo) | **Alinhado** com PRD |
| RNF / RS catalogados | Seções 4–5 como pendência | Hash, JWT, isolamento, HTTPS em produção, LGPD em docs | Manter “pendência formal” ou citar o que já existe embutido nos RFs |
| E-mail transacional | RF003 genérico | Decisão TCC: Gmail dedicado, sem domínio | Incluir no requirements ou só em project-decisions |
| Telas extras | Não nos RF | Configurações, LGPD/Termos, Informações do Sistema, Home, Histórico (abas) | **App → Doc** — listar como extensões de UX / Figma |
| Autoridade do scoring | Implícito | Regra explícita: cálculo e PDF **só no servidor** | Já em architecture/backend docs; pode reforçar no requirements |

---

## Checklist sugerido ao adaptar o `requirements.md`

Prioridade alta (mudam regra ou fluxo narrado):

1. **Escolaridade** — passar a **obrigatória** no cadastro (como o app), e ajustar texto do MEEM/LGPD se necessário.  
2. **Contato** — “telefone celular” (como a UI) **ou** “e-mail ou telefone” se a UI for expandida depois.  
3. **RF007 + RF008** — uma etapa “Aplicar teste” (instrumento + paciente), alinhada ao Figma.  
4. **RF005** — remover/adaptar “resultados por página 10/25/50” e “ordenar por cabeçalho”; descrever busca + filtros mobile.  
5. **RF011** — PDF e evolução como estão (atalho no detalhe; gráfico no resultado); comparativo `delta` só se for implementar ou declarar fora do escopo.

Prioridade média (copy / rastreabilidade):

6. Autores na lista de instrumentos (consumir API ou relaxar obrigatoriedade no doc).  
7. Mensagens de lista vazia.  
8. Decisão de e-mail TCC (RF003).  
9. Telas de Configurações / LGPD / Informações do Sistema.

---

## O que **não** precisa mudar no documento por “falta de feature”

- Cinco instrumentos do MVP e regras de cálculo (TUG, Katz, Berg, Tinetti, MEEM).  
- Isolamento por fisioterapeuta.  
- Tutorial antes da coleta.  
- Finalize com resultado/classificação no servidor.  
- Gráfico com ≥ 2 avaliações.  
- PDF institucional gerado no backend.

---

*Documento gerado para orientar a revisão do levantamento. Quando o `requirements.md` for atualizado, este arquivo pode ser arquivado ou reduzido a um histórico de “gaps fechados”.*
